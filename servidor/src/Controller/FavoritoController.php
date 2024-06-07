<?php

namespace App\Controller;

use App\Entity\Favorito;
use App\Entity\User;
use App\Entity\Zapatilla;
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
    
}