<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreatePaymentsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'payment_id'    => ['type' => 'INT', 'auto_increment' => true],
            'user_id'       => ['type' => 'INT'],
            'amount'        => ['type' => 'INT'],
            'payment_method'=> ['type' => "ENUM('bank','mobile_money','check','wallet')"],
            'sender_number' => ['type' => 'VARCHAR', 'constraint' => 20, 'null' => true],
            'proof_image'   => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'status'        => ['type' => "ENUM('en attente','rejeté','validé')", 'default' => 'en attente'],
            'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
        ]);
        $this->forge->addKey('payment_id', true);
        $this->forge->createTable('payments', true);
    }

    public function down()
    {
        $this->forge->dropTable('payments');
    }
}
