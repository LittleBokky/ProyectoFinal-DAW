<?php
namespace App\Controller;

use App\Entity\User;
use App\Entity\Zapatilla;
use App\Entity\Marca;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ZapatillaController extends AbstractController
{
    #[Route('/zapatillas', name: 'get_zapatillas', methods: ['GET'])]
    public function getAllZapatillas(EntityManagerInterface $entityManager): JsonResponse
    {
        $zapatillas = $entityManager->getRepository(Zapatilla::class)->findAll();
        $data = [];

        foreach ($zapatillas as $zapatilla) {
            $data[] = [
                'id' => $zapatilla->getId(),
                'name' => $zapatilla->getName(),
                'price' => $zapatilla->getPrice(),
                'size' => $zapatilla->getSize(), // Agregado el tamaño
                'username' => $zapatilla->getUser()->getUsername(),     
                'image' => $zapatilla->getImage(),
                'marca' => $zapatilla->getMarca()->getName()
            ];
        }

        return new JsonResponse($data);
    }

    #[Route('/sell', name: 'add_zapatilla', methods: ['POST'])]
    public function addZapatilla(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $name = $request->request->get('name');
        $price = $request->request->get('price');
        $user_id = $request->request->get('user_id');
        $image = $request->files->get('image');
        $size = $request->request->get('size');
        $marcaid = $request->request->get('marca_id');

        if (!$name || !$price || !$image || !$user_id || !$size) { // Comprobación adicional para el campo de tamaño
            return new JsonResponse(['error' => 'Invalid data'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $marca = $entityManager->find(Marca::class, $marcaid);

        // Debug: Log the received user_id
        error_log("Received user_id: " . $user_id);

        // Obtener el usuario
        $user = $entityManager->find(User::class, $user_id);

        if (!$user) {
            // Debug: Log user not found
            error_log("User not found with user_id: " . $user_id);
            return new JsonResponse(['error' => 'User not found'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Procesar la imagen
        $imageContent = file_get_contents($image->getPathname());
        $base64Image = base64_encode($imageContent);
        $imageExtension = $image->guessExtension();
        $base64ImageWithHeader = "data:image/{$imageExtension};base64,{$base64Image}";

        // Crear y guardar la zapatilla
        $zapatilla = new Zapatilla();
        $zapatilla->setName($name);
        $zapatilla->setPrice((float)$price);
        $zapatilla->setImage($base64ImageWithHeader); // Asumiendo que tienes un setImage en la entidad Zapatilla
        $zapatilla->setUser($user);
        $zapatilla->setSize((int)$size);
        $zapatilla->setMarca($marca);

        $entityManager->persist($zapatilla);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Zapatilla created successfully'], JsonResponse::HTTP_CREATED);
    }

    #[Route('/zapatilla/{id}/delete', name: 'delete_zapatilla', methods: ['DELETE'])]
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


    
    #[Route('/zapatillas/zapatillaUsuario', name: 'zapatilla_usuario', methods: ['GET'])]
    public function getUserZapatillas(EntityManagerInterface $entityManager): JsonResponse
    {
        $zapatillas = $entityManager->getRepository(Zapatilla::class)->findBy(['user' => $this->getUser()]);
        $data = [];

        foreach ($zapatillas as $zapatilla) {
            $data[] = [
                'id' => $zapatilla->getId(),
                'name' => $zapatilla->getName(),
                'price' => $zapatilla->getPrice(),
                'marca' => $zapatilla->getMarca()->getName(),
                'size' => $zapatilla->getSize(), // Agregar tamaño
                'username' => $zapatilla->getUser()->getUsername(),
                'image' => $zapatilla->getImage()
            ];
        }

        return new JsonResponse($data);
    }

    #[Route('/marcas', name: 'get_marcas', methods: ['GET'])]
public function getAllMarcas(EntityManagerInterface $entityManager): Response
{
    $marcas = $entityManager->getRepository(Marca::class)->findAll();
    $data = [];

    foreach ($marcas as $marca) {
        $data[] = [
            'id' => $marca->getId(),
            'name' => $marca->getName(),
        ];
    }

    return new JsonResponse($data);
}
    
}
