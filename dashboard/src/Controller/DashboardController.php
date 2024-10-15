<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class DashboardController extends AbstractController
{
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    #[Route('/', name: 'app_index')]
    public function index(): Response
    {
        if ($this->security->getUser()) {
            return new RedirectResponse($this->generateUrl('app_perso'));
        } else {
            return new RedirectResponse($this->generateUrl('app_login'));
        }
    }

    #[Route('/perso', name: 'app_perso')]
    public function perso(): Response
    {
        return $this->render('dashboard/perso.html.twig', [
            'controller_name' => 'DashboardController',
        ]);
    }
}
