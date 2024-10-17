<?php

namespace App\Controller;

use App\Repository\LogsRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DashboardController extends AbstractController
{
    private $security;
    private $logRepository;

    public function __construct(Security $security, LogsRepository $logRepository)
    {
        $this->security = $security;
        $this->logRepository = $logRepository;
    }

    #[Route('/', name: 'app_index')]
    public function index(): Response
    {
        // Redirection selon la connexion de l'utilisateur
        if ($this->security->getUser()) {
            return $this->redirectToRoute('app_perso');
        } else {
            return $this->redirectToRoute('app_login');
        }
    }

    #[Route('/perso', name: 'app_perso')]
    public function perso(): Response
    {
        // Récupérer l'utilisateur connecté
        $user = $this->security->getUser();

        // Si l'utilisateur est connecté, récupérer ses logs
        if ($user) {
            $logs = $this->logRepository->findBy(['user' => $user]);
        } else {
            $logs = [];
        }

        // Envoyer les logs à la vue
        return $this->render('dashboard/perso.html.twig', [
            'controller_name' => 'DashboardController',
            'logs' => $logs,  // On envoie les logs à la vue Twig
        ]);
    }
}