<?php

namespace App\Controller;

use App\Entity\Threat;
use App\Entity\TypeThreat;
use App\Form\ThreatFormType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class SignalementController extends AbstractController
{
    #[Route('/signalement', name: 'app_signalement')]
    public function index(Request $request, EntityManagerInterface $entityManager): Response
    {
        $threat = new Threat();
        $form = $this->createForm(ThreatFormType::class, $threat);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($threat);
            $entityManager->flush();
            return $this->redirectToRoute('app_perso');
        }

        return $this->render('signalement/index.html.twig', [
            'threatForm' => $form,
        ]);
    }

    #[Route('/signalement/checkurl', name: 'check_url')]
    public function checkUrl(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $url = $request->query->get('url');

        if (!$url) {
            return new JsonResponse(['error' => 'No URL provided'], 400);
        }

        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            return new JsonResponse(['error' => 'Invalid URL'], 400);
        }

        $typeThreats = $entityManager->getRepository(TypeThreat::class)->findAll();

        $result = [];

        foreach ($typeThreats as $typeThreat) {
            $count = $entityManager->getRepository(Threat::class)->count([
                'url' => $url,
                'type' => $typeThreat
            ]);
            $result[strtolower($typeThreat->getName())] = $count;
        }

        return new JsonResponse($result);
    }
}
