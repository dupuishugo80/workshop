<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class SignalementController extends AbstractController
{
    #[Route('/signalement', name: 'app_signalement')]
    public function index(): Response
    {
        return $this->render('signalement/index.html.twig', [
            'controller_name' => 'SignalementController',
        ]);
    }
}
