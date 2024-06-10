<?php

namespace App\Controller;

use App\Entity\Zapatilla;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ProfileController extends AbstractController
{

    private $entityManager;
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }
    #[Route('/user/{id}/zapatillas', name: 'user_zapatillas')]
    public function getUserZapatillas(int $id): JsonResponse
    {
        // Consultar las zapatillas del usuario con el ID especificado
        $zapatillasRepository = $this->entityManager->getRepository(Zapatilla::class);
        $zapatillas = $zapatillasRepository->findBy(['user' => $id]);

        // Preparar los datos de las zapatillas para la respuesta JSON
        $formattedZapatillas = [];
        foreach ($zapatillas as $zapatilla) {
            $formattedZapatillas[] = [
                'id' => $zapatilla->getId(),
                'marca' => $zapatilla->getMarca()->getName(),
                'name' => $zapatilla->getName(),
                'size' => $zapatilla->getSize(),
                'price' => $zapatilla->getPrice(),
                'image' => $zapatilla->getImage()
            ];
        }
        // Devolver las zapatillas en formato JSON
        return new JsonResponse($formattedZapatillas);
    }
}
