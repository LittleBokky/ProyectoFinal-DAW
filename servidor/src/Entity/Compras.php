<?php

namespace App\Entity;

use App\Repository\ComprasRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ComprasRepository::class)]
class Compras
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    private ?Zapatilla $zapatilla = null;

    #[ORM\ManyToOne(inversedBy: 'compras')]
    private ?User $user = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getZapatilla(): ?Zapatilla
    {
        return $this->zapatilla;
    }

    public function setZapatilla(?Zapatilla $zapatilla): static
    {
        $this->zapatilla = $zapatilla;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }
}
