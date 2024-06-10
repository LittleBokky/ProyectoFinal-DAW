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
        $username = $request->request->get('username');
        $password = $request->request->get('password');
        $file = $request->files->get('avatar');
    
        if (!$username || !$password) {
            return new JsonResponse(['error' => 'Username and password are required'], JsonResponse::HTTP_BAD_REQUEST);
        }
    
        // Procesar la imagen del avatar si está presente
        $base64Avatar = null;
        if ($file) {
            $imageContent = file_get_contents($file->getPathname());
            $base64Image = base64_encode($imageContent);
            $imageExtension = $file->guessExtension();
            $base64Avatar = "data:image/{$imageExtension};base64,{$base64Image}";
        }
    
        // Crear una nueva instancia de la entidad User
        $user = new User();
        $user->setUsername($username);
    
        // Hashear la contraseña y establecerla en la entidad User
        $hashedPassword = $this->passwordHasher->hashPassword($user, $password);
        $user->setPassword($hashedPassword);
    
        // Establecer el avatar en la entidad User
        if ($base64Avatar) {
            $user->setAvatar($base64Avatar); // Asumiendo que tienes un setAvatar en la entidad User
        }
    
        // Guardar el nuevo usuario en la base de datos
        $this->entityManager->persist($user);
        $this->entityManager->flush();
    
        // Retornar una respuesta JSON
        return new JsonResponse(['message' => 'User registered successfully'], JsonResponse::HTTP_CREATED);
    }
    
}
