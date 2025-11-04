<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateInvestmentsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'investment_id'  => ['type' => 'INT', 'auto_increment' => true],
            'quantity'       => ['type' => 'INT'],
            'total_amount'   => ['type' => 'INT'],
           'created_date datetime default current_timestamp',
            'user_id'        => ['type' => 'INT'],
            'pack_id'        => ['type' => 'INT'],
            'product_id'     => ['type' => 'INT'],
        ]);
        $this->forge->addKey('investment_id', true);
        $this->forge->createTable('investments', true);
    }

    public function down()
    {
        $this->forge->dropTable('investments');
    }
}
