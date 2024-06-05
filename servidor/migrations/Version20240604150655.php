<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240604150655 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE zapatilla ADD marca_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE zapatilla ADD CONSTRAINT FK_484948B381EF0041 FOREIGN KEY (marca_id) REFERENCES marca (id)');
        $this->addSql('CREATE INDEX IDX_484948B381EF0041 ON zapatilla (marca_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE zapatilla DROP FOREIGN KEY FK_484948B381EF0041');
        $this->addSql('DROP INDEX IDX_484948B381EF0041 ON zapatilla');
        $this->addSql('ALTER TABLE zapatilla DROP marca_id');
    }
}
