<?php

namespace App\Entity;

use App\Repository\ZapatillaImgRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ZapatillaImgRepository::class)]
class ZapatillaImg
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 1000000)]
    private ?string $name = null;

    #[ORM\ManyToOne(inversedBy: 'images')]
    private ?Zapatilla $zapatilla = null;

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

    public function getZapatilla(): ?Zapatilla
    {
        return $this->zapatilla;
    }

    public function setZapatilla(?Zapatilla $zapatilla): static
    {
        $this->zapatilla = $zapatilla;

        return $this;
    }
}
