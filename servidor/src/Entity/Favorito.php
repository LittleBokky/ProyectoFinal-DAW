<?php

namespace App\Entity;

use App\Repository\FavoritoRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FavoritoRepository::class)]
class Favorito
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'favoritos')]
    private ?Zapatilla $zapatilla = null;

    #[ORM\ManyToOne(inversedBy: 'favoritos')]
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
