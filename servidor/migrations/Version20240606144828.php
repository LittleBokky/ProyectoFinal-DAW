<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240606144828 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE compras (id INT AUTO_INCREMENT NOT NULL, zapatilla_id INT DEFAULT NULL, user_id INT DEFAULT NULL, UNIQUE INDEX UNIQ_3692E1B796F9B908 (zapatilla_id), INDEX IDX_3692E1B7A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE compras ADD CONSTRAINT FK_3692E1B796F9B908 FOREIGN KEY (zapatilla_id) REFERENCES zapatilla (id)');
        $this->addSql('ALTER TABLE compras ADD CONSTRAINT FK_3692E1B7A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE compras DROP FOREIGN KEY FK_3692E1B796F9B908');
        $this->addSql('ALTER TABLE compras DROP FOREIGN KEY FK_3692E1B7A76ED395');
        $this->addSql('DROP TABLE compras');
    }
}
