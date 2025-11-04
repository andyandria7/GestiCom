<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateWithdrawalsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'withdrawal_id' => ['type' => 'INT', 'auto_increment' => true],
            'user_id'       => ['type' => 'INT'],
            'amount'        => ['type' => 'INT'],
            'payment_method'=> ['type' => "ENUM('mobile_money')", 'default' => 'mobile_money'],
            'receiver_number'=> ['type' => 'VARCHAR', 'constraint' => 20],
            'status'        => ['type' => "ENUM('en attente','refusé','validé')", 'default' => 'en attente'],
            'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
        ]);
        $this->forge->addKey('withdrawal_id', true);
        $this->forge->createTable('withdrawals', true);
    }

    public function down()
    {
        $this->forge->dropTable('withdrawals');
    }
}
