<?php

namespace App\Controller;

use App\Entity\Compras;
use App\Entity\User;
use App\Entity\Zapatilla;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ComprasController extends AbstractController
{
    #[Route('/compras/get', name: 'app_compra')]
    public function getAllCompras(EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        $id = json_decode($request->getContent(), true)['user_id'] ?? null;

        if (!$id) {
            return new JsonResponse(['error' => 'User ID is missing'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = $entityManager->getRepository(User::class)->find($id);

        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $compras = $entityManager->getRepository(Compras::class)->findBy(['user' => $user]);
        $data = [];

        foreach ($compras as $compra) {
            $zapatilla = $compra->getZapatilla();
            $data[] = [
                'id' => $compra->getId(),
                'user_id' => $user->getId(),
                'zapatilla_id' => $zapatilla->getId(),
                'zapatilla_price' => $zapatilla->getPrice(),
                'zapatilla_marca' => $zapatilla->getMarca()->getName(),
                'zapatilla_size' => $zapatilla->getSize(),
                'zapatilla_name' => $zapatilla->getName(),
                'zapatilla_image' => $zapatilla->getImage(),
                'zapatilla_user' => $zapatilla->getUser()->getUsername()
            ];
        }

        return new JsonResponse($data);
    }

    #[Route('/compra/new', name: 'app_compras')]
    public function newCompras(EntityManagerInterface $entityManager, Request $request, UserRepository $userRepository): JsonResponse
    {
        // Obtener user_id y zapatilla_id del contenido JSON de la solicitud
        $data = json_decode($request->getContent(), true);
        $user_id = $data['user_id'] ?? null;
        $zapatilla_id = $data['zapatilla_id'] ?? null;

        if (!$user_id || !$zapatilla_id) {
            return new JsonResponse(['error' => 'User ID and Zapatilla ID are required'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = $userRepository->find($user_id);
        $zapatilla = $entityManager->find(Zapatilla::class, $zapatilla_id);

        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        if (!$zapatilla) {
            return new JsonResponse(['error' => 'Zapatilla not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $compra = new Compras();
        $compra->setUser($user);
        $compra->setZapatilla($zapatilla);

        $entityManager->persist($compra);
        $entityManager->flush();

        // Filtrar las zapatillas disponibles después de la compra
        $zapatillasDisponibles = $entityManager->getRepository(Zapatilla::class)->findBy(['is_available' => true]);

        return new JsonResponse(['message' => 'Compra created successfully', 'zapatillas_disponibles' => $zapatillasDisponibles]);
    }

    #[Route('/zapatillas/not-bought', name: 'app_zapatillas_not_bought')]
    public function getAllZapatillasNotBought(EntityManagerInterface $entityManager): JsonResponse
    {
        // Obtener todas las zapatillas
        $allZapatillas = $entityManager->getRepository(Zapatilla::class)->findAll();
    
        // Obtener todas las compras
        $compras = $entityManager->getRepository(Compras::class)->findAll();
        
        // Extraer los IDs de las zapatillas compradas
        $compradasIds = array_map(fn($compra) => $compra->getZapatilla()->getId(), $compras);
        
        // Filtrar las zapatillas para obtener las que no han sido compradas
        $noCompradas = array_filter($allZapatillas, fn($zapatilla) => !in_array($zapatilla->getId(), $compradasIds));
        
        // Preparar datos para la respuesta JSON
        $data = [];
    
        foreach ($noCompradas as $zapatilla) {
            $data[] = [
                'id' => $zapatilla->getId(),
                'name' => $zapatilla->getName(),
                'price' => $zapatilla->getPrice(),
                'image' => $zapatilla->getImage(),
                'username' => $zapatilla->getUser()->getUsername(),
                'size' => $zapatilla->getSize(),
                'marca' => $zapatilla->getMarca()->getName()
            ];
        }
    
        return new JsonResponse($data);
    }
    
    
}