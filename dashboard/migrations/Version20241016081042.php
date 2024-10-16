<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241016081042 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE threat (id INT AUTO_INCREMENT NOT NULL, type_id INT NOT NULL, url VARCHAR(255) NOT NULL, added_date DATETIME NOT NULL, INDEX IDX_2C975CE7C54C8C93 (type_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE type_threat (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, warning_level INT NOT NULL, warning_color VARCHAR(7) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE threat ADD CONSTRAINT FK_2C975CE7C54C8C93 FOREIGN KEY (type_id) REFERENCES type_threat (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE threat DROP FOREIGN KEY FK_2C975CE7C54C8C93');
        $this->addSql('DROP TABLE threat');
        $this->addSql('DROP TABLE type_threat');
    }
}
