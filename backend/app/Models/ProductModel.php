<?php namespace App\Models;

use CodeIgniter\Model;

class ProductModel extends Model
{
    protected $table = 'products';

    protected $primaryKey = 'product_id';
    protected $allowedFields = ['name','description','unit_price', 'available_quantity', 'image_url','reference','commission_rate', 'created_at'];
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = '';
    protected $dateFormat    = 'datetime';
}


