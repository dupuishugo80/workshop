<?php

namespace App\Controller;

use App\Entity\Logs;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class LogsController extends AbstractController
{
    #[Route('/logs/add', name: 'app_logs', methods: ['POST'])]
    public function index(Request $request, EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);
    
        if (!isset($data['url'], $data['warning_level'], $data['email'])) {
            return new JsonResponse(['error' => 'Invalid data'], Response::HTTP_BAD_REQUEST);
        }
    
        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);

        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_BAD_REQUEST);
        }

        $log = new Logs();
        $log->setUrl($data['url']);
        $log->setWarningType($data['warning_level']);
        $log->setDate(new \DateTime());
        $log->setUser($user);

        $entityManager->persist($log);
        $entityManager->flush();

    
        return new JsonResponse($data, Response::HTTP_CREATED);
    }
}
