<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateDeliveriesTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'delivery_id'     => ['type' => 'INT', 'auto_increment' => true],
            'product_id'      => ['type' => 'INT'],
            'product_quantity'=> ['type' => 'INT'],
            'client_id'       => ['type' => 'INT'],
            'user_id'         => ['type' => 'INT'],
        ]);
        $this->forge->addKey('delivery_id', true);
        $this->forge->createTable('deliveries',true);
    }

    public function down()
    {
        $this->forge->dropTable('deliveries');
    }
}
