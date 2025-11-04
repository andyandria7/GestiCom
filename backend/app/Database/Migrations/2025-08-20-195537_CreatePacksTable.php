<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreatePacksTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'pack_id'             => ['type' => 'INT', 'auto_increment' => true],
            'product_id'          => ['type' => 'INT'],
            'pack_name'           => ['type' => 'VARCHAR', 'constraint' => 255],
            'order_start_date'    => ['type' => 'DATETIME'],
            'min_investment'      => ['type' => 'BIGINT'],
            'objective_quantity'  => ['type' => 'INT'],
            'return_on_investment'=> ['type' => 'INT'],
        ]);
        $this->forge->addKey('pack_id', true);
        $this->forge->createTable('packs', true);
    }

    public function down()
    {
        $this->forge->dropTable('packs');
    }
}
