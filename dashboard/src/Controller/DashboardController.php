<?php

namespace App\Controller;

use App\Repository\LogsRepository;
use App\Repository\TypeThreatRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DashboardController extends AbstractController
{
    private $security;
    private $logRepository;
    private $typeThreatRepository;

    public function __construct(Security $security, LogsRepository $logRepository, TypeThreatRepository $typeThreatRepository)
    {
        $this->security = $security;
        $this->logRepository = $logRepository;
        $this->typeThreatRepository = $typeThreatRepository;
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
            // Récupérer les logs de l'utilisateur connecté avec leurs types de menace
            $logs = $this->logRepository->findBy(criteria: ['user' => $user]);
            $threatTypes = $this->typeThreatRepository->findAll();

            $threatTypeMap = [];
            foreach ($threatTypes as $type) {
                $threatTypeMap[$type->getWarningLevel()] = $type->getName();
            }

            // Ajouter le nom du type de menace à chaque log
            foreach ($logs as $log) {
                $log->threatName = $threatTypeMap[$log->getWarningType()] ?? 'Unknown';
            }

            // Optionnel: Si tu souhaites filtrer ou manipuler les logs ici, tu peux le faire
        } else {
            $logs = [];
        }

        // Envoyer les logs à la vue, incluant les informations sur les types de menace
        return $this->render('dashboard/perso.html.twig', [
            'controller_name' => 'DashboardController',
            'logs' => $logs,  // Envoie des logs et des informations de type menace à la vue
        ]);
    }
}

