<?php

namespace App\Controller;

use App\Entity\Favorito;
use App\Entity\User;
use App\Entity\Zapatilla;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class FavoritoController extends AbstractController
{
    #[Route('/favorito/new', name: 'new_favorito')]
    public function new(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
    
        if (is_null($data) || !isset($data['user_id']) || !isset($data['zapatilla_id'])) {
            return new JsonResponse(['error' => 'Invalid input'], JsonResponse::HTTP_BAD_REQUEST);
        }
    
        $user_id = $data['user_id'];
        $zapatilla_id = $data['zapatilla_id'];
    
        $user = $entityManager->find(User::class, $user_id);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
        }
    
        $zapatilla = $entityManager->find(Zapatilla::class, $zapatilla_id);
        if (!$zapatilla) {
            return new JsonResponse(['error' => 'Zapatilla not found'], JsonResponse::HTTP_NOT_FOUND);
        }
    
        $favoritoRepository = $entityManager->getRepository(Favorito::class);
        $existingFavorito = $favoritoRepository->findOneBy(['user' => $user, 'zapatilla' => $zapatilla]);
    
        if ($existingFavorito) {
            $entityManager->remove($existingFavorito);
            $entityManager->flush();
            return new JsonResponse(['success' => false, 'message' => 'Favorito already exists']);
        }
    
        $favorito = new Favorito();
        $favorito->setUser($user);
        $favorito->setZapatilla($zapatilla);
    
        $entityManager->persist($favorito);
        $entityManager->flush();
    
        return new JsonResponse(['success' => true, 'message' => 'Favorito created successfully'], JsonResponse::HTTP_CREATED);
    }
    
    #[Route('/favorito/get', name: 'get_favorito')]
    public function getFavoritoByUserId(EntityManagerInterface $entityManager, UserRepository $userRepository, Request $request): JsonResponse
    {
        $id = json_decode($request->getContent(), true)['user_id'] ?? null;
    
        if (!$id) {
            return new JsonResponse(['error' => 'User ID is missing'], JsonResponse::HTTP_BAD_REQUEST);
        }
    
        $user = $entityManager->getRepository(User::class)->find($id);
    
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
        }
    
        $favoritos = $entityManager->getRepository(Favorito::class)->findBy(['user' => $user]);
        $data = [];
    
        foreach ($favoritos as $favorito) {
            $zapatilla = $favorito->getZapatilla();
            $data[] = [
                'id' => $favorito->getId(),
                'user_id' => $user->getId(),
                'zapatilla_id' => $zapatilla->getId(),
                'zapatilla_price' => $zapatilla->getPrice(),
                'zapatilla_marca' => $zapatilla->getMarca()->getName(),
                'zapatilla_size' => $zapatilla->getSize(),
                'zapatilla_name' => $zapatilla->getName(),
                'zapatilla_image' => $zapatilla->getImage(),
                'zapatilla_user' => $zapatilla->getUser()->getUsername(),
            ];
        }
    
        return new JsonResponse($data);
      
    }
}