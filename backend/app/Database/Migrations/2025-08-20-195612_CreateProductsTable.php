<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateProductsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'product_id'        => ['type' => 'INT', 'auto_increment' => true],
            'name'              => ['type' => 'VARCHAR', 'constraint' => 255],
            'image_url'         => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'unit_price'        => ['type' => 'INT'],
            'available_quantity'=> ['type' => 'INT'],
            'description'       => ['type' => 'TEXT', 'null' => true],
        ]);
        $this->forge->addKey('product_id', true);
        $this->forge->createTable('products', true);
    }

    public function down()
    {
        $this->forge->dropTable('products');
    }
}
