<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240523211252 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE zapatilla_img (id INT AUTO_INCREMENT NOT NULL, zapatilla_id INT DEFAULT NULL, name MEDIUMTEXT NOT NULL, INDEX IDX_DE5BD1B496F9B908 (zapatilla_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE zapatilla_img ADD CONSTRAINT FK_DE5BD1B496F9B908 FOREIGN KEY (zapatilla_id) REFERENCES zapatilla (id)');
        $this->addSql('ALTER TABLE zapatilla ADD price DOUBLE PRECISION NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE zapatilla_img DROP FOREIGN KEY FK_DE5BD1B496F9B908');
        $this->addSql('DROP TABLE zapatilla_img');
        $this->addSql('ALTER TABLE zapatilla DROP price');
    }
}
