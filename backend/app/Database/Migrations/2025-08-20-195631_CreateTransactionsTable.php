<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateTransactionsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'transaction_id'=> ['type' => 'INT', 'auto_increment' => true],
            'user_id'       => ['type' => 'INT'],
            'amount'        => ['type' => 'INT'],
            'status'        => ['type' => "ENUM('en attente','rejeté','validé')", 'default' => 'en attente'],
            'type'          => ['type' => "ENUM('deposit','payment_request','withdrawal')"],
            'payment_method'=> ['type' => "ENUM('bank','check','mobile_money','wallet')", 'null' => true],
            'sender_number' => ['type' => 'VARCHAR', 'constraint' => 20, 'null' => true],
            'receiver_number'=> ['type' => 'VARCHAR', 'constraint' => 20, 'null' => true],
            'proof_image'   => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'deposit_id'    => ['type' => 'INT', 'null' => true],
            'withdrawal_id' => ['type' => 'INT', 'null' => true],
            'payment_id'    => ['type' => 'INT', 'null' => true],
            'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
        ]);
        $this->forge->addKey('transaction_id', true);
        $this->forge->createTable('transactions', true);
    }

    public function down()
    {
        $this->forge->dropTable('transactions');
    }
}
