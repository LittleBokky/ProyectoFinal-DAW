<?php
// src/Controller/AuthController.php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use App\Repository\UserRepository;
use Symfony\Component\Routing\Attribute\Route;

class AuthController extends AbstractController
{
    private $jwtManager;
    private $userRepository;
    private $passwordHasher;

    public function __construct(JWTTokenManagerInterface $jwtManager, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher)
    {
        $this->jwtManager = $jwtManager;
        $this->userRepository = $userRepository;
        $this->passwordHasher = $passwordHasher;
    }

    #[Route('/api/login', name: 'app_api_login', methods: ['POST'])]
    public function authenticate(Request $request)
    {
        $data = json_decode($request->getContent(), true);

        $username = $data['username'] ?? null;
        $password = $data['password'] ?? null;

        if (!$username || !$password) {
            return new JsonResponse(['error' => 'Username and password are required'], 400);
        }

        // Buscar el usuario en la base de datos
        $user = $this->userRepository->findOneBy(['username' => $username]);

        if (!$user || !$this->passwordHasher->isPasswordValid($user, $password)) {
            throw new BadCredentialsException();
        }

        // Si la autenticación es exitosa, generamos el token JWT
        $token = $this->jwtManager->create($user);
        $userId = $user->getId();

        // Responder con el token
        return new JsonResponse(['user' => $username, 'token' => $token, 'user_id' => $userId]);
    }
}