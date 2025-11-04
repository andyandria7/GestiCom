<?php

namespace App\Models;

use CodeIgniter\Model;

class DeliveryModel extends Model
{
     protected $table = 'deliveries';
    protected $primaryKey = 'delivery_id';

    protected $allowedFields = [
        'client_id',
        'product_id',
        'place',
        'delivery_date',
        'quantity',
        'created_at',
        'updated_at',
        'user_id',
        'status'
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $beforeInsert   = ['setDefaultStatus'];

    protected function setDefaultStatus(array $data)
    {
        if (! isset($data['data']['status'])) {
            $data['data']['status'] = 0; 
        }
        return $data;
    }

}
