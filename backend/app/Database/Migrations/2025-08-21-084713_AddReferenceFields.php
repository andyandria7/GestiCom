<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddReferenceFields extends Migration
{
    public function up()
    {
        $db = \Config\Database::connect();

    if (! $db->fieldExists('reference', 'transactions')) {
        $this->forge->addColumn('transactions', [
            'reference' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'null'       => false,
                'after'      => 'created_at'
            ]
        ]);
    }

    if (! $db->fieldExists('reference', 'products')) {
        $this->forge->addColumn('products', [
            'reference' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'null'       => false,
                'after'      => 'description'
            ]
        ]);
    }

        $this->forge->addColumn('packs', [
            'reference' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'null'       => false,
                'after'      => 'return_on_investment'
            ]
        ]);

        $this->forge->addColumn('deposits', [
            'reference' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'null'       => false,
                'after'      => 'created_at'
            ]
        ]);

        $this->forge->addColumn('payments', [
            'reference' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'null'       => false,
                'after'      => 'created_at'
            ]
        ]);

        $this->forge->addColumn('withdrawals', [
            'reference' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'null'       => false,
                'after'      => 'created_at'
            ]
        ]);
        $this->forge->addColumn('investments', [
            'reference' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
                'null'       => false,
                'after'      => 'created_at'
            ]
        ]);
    }

    public function down()
    {
        $this->forge->dropColumn('transactions', 'reference');
        $this->forge->dropColumn('products', 'reference');
        $this->forge->dropColumn('packs', 'reference');
        $this->forge->dropColumn('deposits', 'reference');
        $this->forge->dropColumn('payments', 'reference');
        $this->forge->dropColumn('withdrawals', 'reference');
        $this->forge->dropColumn('investments', 'reference');
    }
}
