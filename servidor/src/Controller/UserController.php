<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\String\Slugger\SluggerInterface;

class UserController extends AbstractController
{
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

    #[Route('/user/{id}/update', name: 'update_user_profile', methods: ['POST'])]
    public function updateUserProfile(
        int $id,
        Request $request,
        EntityManagerInterface $entityManager,
        SluggerInterface $slugger
    ): JsonResponse
    {
        $user = $entityManager->getRepository(User::class)->find($id);

        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        $username = $data['username'] ?? null;
        $avatarBase64 = $data['avatar'] ?? null;

        if ($username) {
            $user->setUsername($username);
        }

        if ($avatarBase64) {
            $avatarContent = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $avatarBase64));
            $originalFilename = uniqid();
            $newFilename = $originalFilename . '.png';

            $uploadsDirectory = $this->getParameter('profiles_directory');
            $filePath = $uploadsDirectory . '/' . $newFilename;

            try {
                file_put_contents($filePath, $avatarContent);
                $user->setAvatar('/uploads/profiles/' . $newFilename);
            } catch (\Exception $e) {
                return new JsonResponse(['error' => 'Failed to upload avatar'], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        }

        try {
            $entityManager->persist($user);
            $entityManager->flush();

            return new JsonResponse([
                'username' => $user->getUsername(),
                'avatar' => $user->getAvatar(),
            ]);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Failed to update profile'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
