<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateDeliveriesTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'delivery_id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'client_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
            ],
            'place' => [
                'type'       => 'VARCHAR',
                'constraint' => '150',
            ],
            'delivery_date' => [
                'type' => 'DATETIME',
            ],
            'quantity' => [
                'type'       => 'INT',
                'constraint' => 11,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);

        $this->forge->addKey('delivery_id', true);
        $this->forge->createTable('deliveries', true);
    }

    public function down()
    {
        $this->forge->dropTable('deliveries', true);
    }
}
