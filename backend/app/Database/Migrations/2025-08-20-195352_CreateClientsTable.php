<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateClientsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'client_id'  => ['type' => 'INT', 'auto_increment' => true],
            'first_name' => ['type' => 'VARCHAR', 'constraint' => 100],
            'last_name'  => ['type' => 'VARCHAR', 'constraint' => 100],
            'adresse'    => ['type' => 'TEXT'],
            'contact'    => ['type' => 'INT'],
        ]);
        $this->forge->addKey('client_id', true);
        $this->forge->createTable('clients', true);
    }

    public function down()
    {
        $this->forge->dropTable('clients');
    }
}
