<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateUsersTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'user_id'        => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'first_name'     => ['type' => 'VARCHAR', 'constraint' => 100],
            'last_name'      => ['type' => 'VARCHAR', 'constraint' => 100],
            'phone_number'   => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true],
            'email'          => ['type' => 'VARCHAR', 'constraint' => 100],
            'date_of_birth'  => ['type' => 'VARCHAR', 'constraint' => 100],
            'password'       => ['type' => 'VARCHAR', 'constraint' => 100],
            'role'           => ['type' => "ENUM('commercial','investor')"],
            'created_at'     => ['type' => 'DATETIME', 'default' => 'CURRENT_TIMESTAMP'],
            'updated_at'     => ['type' => 'DATETIME', 'default' => 'CURRENT_TIMESTAMP'],
            'profile_picture'=> ['type' => 'TEXT', 'null' => true],
            'CIN_picture'    => ['type' => 'TEXT', 'null' => true],
        ]);
        $this->forge->addKey('user_id', true);
        $this->forge->createTable('users', true);
    }

    public function down()
    {
        $this->forge->dropTable('users');
    }
}
