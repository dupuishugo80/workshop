<?php

namespace App\Entity;

use App\Repository\TypeThreatRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TypeThreatRepository::class)]
class TypeThreat
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column]
    private ?int $warning_level = null;

    #[ORM\Column(length: 7)]
    private ?string $warning_color = null;

    /**
     * @var Collection<int, Threat>
     */
    #[ORM\OneToMany(targetEntity: Threat::class, mappedBy: 'type', orphanRemoval: true)]
    private Collection $threats;

    public function __construct()
    {
        $this->threats = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getWarningLevel(): ?int
    {
        return $this->warning_level;
    }

    public function setWarningLevel(int $warning_level): static
    {
        $this->warning_level = $warning_level;

        return $this;
    }

    public function getWarningColor(): ?string
    {
        return $this->warning_color;
    }

    public function setWarningColor(string $warning_color): static
    {
        $this->warning_color = $warning_color;

        return $this;
    }

    /**
     * @return Collection<int, Threat>
     */
    public function getThreats(): Collection
    {
        return $this->threats;
    }

    public function addThreat(Threat $threat): static
    {
        if (!$this->threats->contains($threat)) {
            $this->threats->add($threat);
            $threat->setType($this);
        }

        return $this;
    }

    public function removeThreat(Threat $threat): static
    {
        if ($this->threats->removeElement($threat)) {
            // set the owning side to null (unless already changed)
            if ($threat->getType() === $this) {
                $threat->setType(null);
            }
        }

        return $this;
    }
}
