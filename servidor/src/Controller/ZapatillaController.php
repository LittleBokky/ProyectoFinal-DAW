<?php

namespace App\Controller;

use App\Entity\Zapatilla;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class ZapatillaController extends AbstractController
{
    #[Route('/zapatillas', name: 'get_zapatillas')]
    public function getAllZapatillas(EntityManagerInterface $entityManager): JsonResponse
    {
        $zapatillas = $entityManager->getRepository(Zapatilla::class)->findAll();
        $data = [];

        foreach ($zapatillas as $zapatilla) {
            $data[] = [
                'id' => $zapatilla->getId(),
                'name' => $zapatilla->getName(),
                'price' => $zapatilla->getPrice(),
                'images' => array_map(fn($img) => $img->getUrl(), $zapatilla->getImages()->toArray()),
            ];
        }

        return new JsonResponse($data);
    }

    #[Route('/zapatilla', name: 'add_zapatilla', methods: ['POST'])]
    public function addZapatilla(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $name = $data['name'] ?? null;
        $price = $data['price'] ?? null;

        if (!$name || !$price) {
            return new JsonResponse(['error' => 'Invalid data'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $zapatilla = new Zapatilla();
        $zapatilla->setName($name);
        $zapatilla->setPrice((float)$price);

        $entityManager->persist($zapatilla);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Zapatilla created successfully'], JsonResponse::HTTP_CREATED);
    }

    #[Route('/zapatilla/{id}', name: 'delete_zapatilla', methods: ['DELETE'])]
    public function deleteZapatilla(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $zapatilla = $entityManager->getRepository(Zapatilla::class)->find($id);

        if (!$zapatilla) {
            return new JsonResponse(['error' => 'Zapatilla not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $entityManager->remove($zapatilla);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Zapatilla deleted successfully']);
    }
}
