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
{#[Route('/favorito/new', name: 'new_favorito')]
    public function new(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
 
        $user_id = $request->request->get('user_id');
        $zapatilla_id = $request->request->get('zapatilla_id');
        $user = $entityManager->find(User::class, $user_id);
        $zapatilla = $entityManager->find(Zapatilla::class, $zapatilla_id);
        $favorito = new Favorito();
        $favorito->setUser($user);
        $favorito->setZapatilla($zapatilla);
        $entityManager->persist($favorito);
        $entityManager->flush();
        return new JsonResponse(['message' => 'Favorito created successfully']);
    }
}