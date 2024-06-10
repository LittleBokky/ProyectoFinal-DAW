<?php

namespace App\Entity;

use App\Repository\MarcaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MarcaRepository::class)]
class Marca
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    /**
     * @var Collection<int, Zapatilla>
     */
    #[ORM\OneToMany(targetEntity: Zapatilla::class, mappedBy: 'marca')]
    private Collection $zapatilla;

    public function __construct()
    {
        $this->zapatilla = new ArrayCollection();
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

    /**
     * @return Collection<int, Zapatilla>
     */
    public function getZapatilla(): Collection
    {
        return $this->zapatilla;
    }

    public function addZapatilla(Zapatilla $zapatilla): static
    {
        if (!$this->zapatilla->contains($zapatilla)) {
            $this->zapatilla->add($zapatilla);
            $zapatilla->setMarca($this);
        }

        return $this;
    }

    public function removeZapatilla(Zapatilla $zapatilla): static
    {
        if ($this->zapatilla->removeElement($zapatilla)) {
            // set the owning side to null (unless already changed)
            if ($zapatilla->getMarca() === $this) {
                $zapatilla->setMarca(null);
            }
        }

        return $this;
    }
}
