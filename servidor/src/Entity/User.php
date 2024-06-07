<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_USERNAME', fields: ['username'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    private ?string $username = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column(length: 1000000)]
    private ?string $avatar = null;

    /**
     * @var Collection<int, Zapatilla>
     */
    #[ORM\OneToMany(targetEntity: Zapatilla::class, mappedBy: 'user')]
    private Collection $zapatillas;

    /**
     * @var Collection<int, Favorito>
     */
    #[ORM\OneToMany(targetEntity: Favorito::class, mappedBy: 'user')]
    private Collection $favoritos;

    /**
     * @var Collection<int, Compras>
     */
    #[ORM\OneToMany(targetEntity: Compras::class, mappedBy: 'user')]
    private Collection $compras;

    public function __construct()
    {
        $this->zapatillas = new ArrayCollection();
        $this->favoritos = new ArrayCollection();
        $this->compras = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->username;
    }

    /**
     * @see UserInterface
     *
     * @return list<string>
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getAvatar(): ?string
    {
        return $this->avatar;
    }

    public function setAvatar(string $avatar): static
    {
        $this->avatar = $avatar;

        return $this;
    }

    /**
     * @return Collection<int, Zapatilla>
     */
    public function getZapatillas(): Collection
    {
        return $this->zapatillas;
    }

    public function addZapatilla(Zapatilla $zapatilla): static
    {
        if (!$this->zapatillas->contains($zapatilla)) {
            $this->zapatillas->add($zapatilla);
            $zapatilla->setUser($this);
        }

        return $this;
    }

    public function removeZapatilla(Zapatilla $zapatilla): static
    {
        if ($this->zapatillas->removeElement($zapatilla)) {
            // set the owning side to null (unless already changed)
            if ($zapatilla->getUser() === $this) {
                $zapatilla->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Favorito>
     */
    public function getFavoritos(): Collection
    {
        return $this->favoritos;
    }

    public function addFavorito(Favorito $favorito): static
    {
        if (!$this->favoritos->contains($favorito)) {
            $this->favoritos->add($favorito);
            $favorito->setUser($this);
        }

        return $this;
    }

    public function removeFavorito(Favorito $favorito): static
    {
        if ($this->favoritos->removeElement($favorito)) {
            // set the owning side to null (unless already changed)
            if ($favorito->getUser() === $this) {
                $favorito->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Compras>
     */
    public function getCompras(): Collection
    {
        return $this->compras;
    }

    public function addCompra(Compras $compra): static
    {
        if (!$this->compras->contains($compra)) {
            $this->compras->add($compra);
            $compra->setUser($this);
        }

        return $this;
    }

    public function removeCompra(Compras $compra): static
    {
        if ($this->compras->removeElement($compra)) {
            // set the owning side to null (unless already changed)
            if ($compra->getUser() === $this) {
                $compra->setUser(null);
            }
        }

        return $this;
    }
}
