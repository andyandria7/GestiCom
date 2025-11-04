<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateAdminsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'admin_id' => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'name'     => ['type' => 'VARCHAR', 'constraint' => 100],
            'email'    => ['type' => 'VARCHAR', 'constraint' => 100, 'unique' => true],
            'password' => ['type' => 'VARCHAR', 'constraint' => 255],
        ]);
        $this->forge->addKey('admin_id', true);
        $this->forge->createTable('admins', true);
    }

    public function down()
    {
        $this->forge->dropTable('admins');
    }
}
