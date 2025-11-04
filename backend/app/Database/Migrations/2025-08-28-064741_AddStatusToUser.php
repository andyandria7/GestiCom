<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddStatusToUser extends Migration
{
    public function up()
    {
       $this->forge->addColumn('users', [
            'status' => [
                'type'       => 'BOOLEAN',
                'default'    => false, 
                'after'      => 'id',
            ],
        ]);
        
    }

    public function down()
    {
        $this->forge->dropColumn('users', 'status');
    }
}
