<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\String\Slugger\SluggerInterface;

class UserController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }
    #[Route('/user/{id}', name: 'get_user_profile', methods: ['GET'])]
    public function getUserProfile(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $entityManager->getRepository(User::class)->find($id);

        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        return new JsonResponse([
            'username' => $user->getUsername(),
            'avatar' => $user->getAvatar(),
        ]);
    }

    #[Route('/user/{id}/update', name: 'update_user')]
    public function updateUserData(Request $request, UserRepository $userRepository, int $id): JsonResponse
    {
        $user = $userRepository->find($id);

        if (!$user) {
            throw $this->createNotFoundException('No se encontró un usuario para el ID dado');
        }

        // Obtener los datos del cuerpo de la solicitud
        $username = $request->request->get('username');
        $password = $request->request->get('password');
        $avatar = $request->files->get('avatar');

        // Verificar si se proporcionaron los campos de usuario y contraseña
        if (!$username && !$password && !$avatar) {
            return new JsonResponse(['error' => 'At least one field is required'], Response::HTTP_BAD_REQUEST);
        }

        // Actualizar los campos del usuario si no están vacíos
        $isUpdated = false;
        if ($username) {
            $user->setUsername($username);
            $isUpdated = true;
        }

        if ($avatar) {
            // Convertir la imagen a base64
            $avatarBase64 = base64_encode(file_get_contents($avatar->getPathname()));
            $avatarImage = 'data:' . $avatar->getClientMimeType() . ';base64,' . $avatarBase64;
            $user->setAvatar($avatarImage);
            $isUpdated = true;
        }

        if ($isUpdated) {
            // Persistir los cambios en la base de datos
            $this->entityManager->flush();

            // Devolver una respuesta JSON indicando que los datos se han actualizado
            return new JsonResponse(['message' => 'User data updated successfully'], Response::HTTP_OK);
        }

        return new JsonResponse(['error' => 'No data was updated'], Response::HTTP_BAD_REQUEST);
    }
}
