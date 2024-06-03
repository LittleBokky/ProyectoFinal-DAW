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
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Component\Routing\Attribute\Route;

class AuthController extends AbstractController
{
    private $jwtManager;
    private $jwtEncoder;
    private $userRepository;
    private $passwordHasher;

    public function __construct(JWTTokenManagerInterface $jwtManager, JWTEncoderInterface $jwtEncoder, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher)
    {
        $this->jwtManager = $jwtManager;
        $this->jwtEncoder = $jwtEncoder;
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

    #[Route('/api/user', name: 'app_api_user', methods: ['GET'])]
    public function getUserData(Request $request): JsonResponse
    {
        $authHeader = $request->headers->get('Authorization');
        if ($authHeader && preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
        } else {
            return new JsonResponse(['error' => 'Token not found'], 401);
        }

        try {
            $decodedToken = $this->jwtEncoder->decode($token);
            $username = $decodedToken['username'];

            // Buscar el usuario en la base de datos
            $user = $this->userRepository->findOneBy(['username' => $username]);

            if (!$user) {
                return new JsonResponse(['error' => 'User not found'], 404);
            }

            return new JsonResponse([
                'id' => $user->getId(),
                'user' => $user->getUsername(),
                'avatar' => $user->getAvatar()
            ]);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Invalid token'], 401);
        }
    }
}
