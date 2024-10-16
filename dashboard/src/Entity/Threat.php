<?php

namespace App\Entity;

use App\Repository\ThreatRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ThreatRepository::class)]
class Threat
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $url = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $added_date = null;

    #[ORM\ManyToOne(inversedBy: 'threats')]
    #[ORM\JoinColumn(nullable: false)]
    private ?TypeThreat $type = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUrl(): ?string
    {
        return $this->url;
    }

    public function setUrl(string $url): static
    {
        $this->url = $url;

        return $this;
    }

    public function getAddedDate(): ?\DateTimeInterface
    {
        return $this->added_date;
    }

    public function setAddedDate(\DateTimeInterface $added_date): static
    {
        $this->added_date = $added_date;

        return $this;
    }

    public function getType(): ?TypeThreat
    {
        return $this->type;
    }

    public function setType(?TypeThreat $type): static
    {
        $this->type = $type;

        return $this;
    }
}
