<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateWalletsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'wallet_id' => ['type' => 'INT', 'auto_increment' => true],
            'user_id'   => ['type' => 'INT'],
            'balance'   => ['type' => 'INT', 'default' => 0],
        ]);
        $this->forge->addKey('wallet_id', true);
        $this->forge->createTable('wallets', true);
    }

    public function down()
    {
        $this->forge->dropTable('wallets');
    }
}
