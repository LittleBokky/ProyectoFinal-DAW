<?php

namespace App\Entity;

use App\Repository\ZapatillaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ZapatillaRepository::class)]
class Zapatilla
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column]
    private ?float $price = null;

    /**
     * @var Collection<int, ZapatillaImg>
     */
    #[ORM\OneToMany(targetEntity: ZapatillaImg::class, mappedBy: 'zapatilla')]
    private Collection $images;

    public function __construct()
    {
        $this->images = new ArrayCollection();
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

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): static
    {
        $this->price = $price;

        return $this;
    }

    /**
     * @return Collection<int, ZapatillaImg>
     */
    public function getImages(): Collection
    {
        return $this->images;
    }

    public function addImage(ZapatillaImg $image): static
    {
        if (!$this->images->contains($image)) {
            $this->images->add($image);
            $image->setZapatilla($this);
        }

        return $this;
    }

    public function removeImage(ZapatillaImg $image): static
    {
        if ($this->images->removeElement($image)) {
            // set the owning side to null (unless already changed)
            if ($image->getZapatilla() === $this) {
                $image->setZapatilla(null);
            }
        }

        return $this;
    }
}
