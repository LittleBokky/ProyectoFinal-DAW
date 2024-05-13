<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

class RegisterController extends AbstractController
{
    private $passwordHasher;
    private $entityManager;

    public function __construct(UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager)
    {
        $this->passwordHasher = $passwordHasher;
        $this->entityManager = $entityManager;
    }

    #[Route('/register', name: 'app_register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        // Decodificar el JSON enviado en la solicitud
        $data = json_decode($request->getContent(), true);

        // Obtener el nombre de usuario y contraseña del JSON
        $username = $data['username'] ?? null;
        $password = $data['password'] ?? null;

        // Verificar si se enviaron los datos requeridos
        if (!$username || !$password) {
            return new JsonResponse(['error' => 'Username and password are required'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Crear una nueva instancia de la entidad User
        $user = new User();
        $user->setUsername($username);

        // Hashear la contraseña y establecerla en la entidad User
        $hashedPassword = $this->passwordHasher->hashPassword($user, $password);
        $user->setPassword($hashedPassword);

        // Guardar el nuevo usuario en la base de datos
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        // Retornar una respuesta JSON
        return new JsonResponse(['message' => 'User registered successfully'], JsonResponse::HTTP_CREATED);
    }
}
