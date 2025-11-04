<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddProductIdToDeliveries extends Migration
{
    public function up()
    {
        $fields = [
            'product_id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'null' => true, // si optionnel
            ],
        ];
        $this->forge->addColumn('deliveries', $fields);
    }

    public function down()
    {
        $this->forge->dropColumn('deliveries', 'product_id');
    }
}
