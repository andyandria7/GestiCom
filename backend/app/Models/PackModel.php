<?php

namespace App\Models;

use CodeIgniter\Model;

class PackModel extends Model
{
    protected $table = 'packs';
    protected $primaryKey = 'pack_id';

    protected $allowedFields = [
        'product_id',
        'pack_name',
        'order_start_date',
        'min_investment',
        'objective_quantity',
        'return_on_investment', 
        'reference',
        'created_at', 
    ];

    // Active uniquement created_at
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = ''; 
    protected $dateFormat    = 'datetime';

    public function getPackProgress($packId)
    {
        $db = \Config\Database::connect();

        $builder = $db->table('packs p');
        $builder->select('
            p.pack_id,
            p.pack_name,
            p.objective_quantity,
            COALESCE(SUM(i.quantity), 0) AS total_invested,
            (p.objective_quantity - COALESCE(SUM(i.quantity),0)) AS remaining_quantity,
            (COALESCE(SUM(i.quantity), 0) / p.objective_quantity) * 100 AS progress_percentage
        ');
        $builder->join('investments i', 'i.pack_id = p.pack_id', 'left');
        $builder->where('p.pack_id', $packId);
        $builder->groupBy('p.pack_id');

        return $builder->get()->getRow();
    }

    public function getAllPackProgress()
    {
        $db = \Config\Database::connect();

        $builder = $db->table('packs p');
        $builder->select('
            p.pack_id,
            p.pack_name,
            p.objective_quantity,
            COALESCE(SUM(i.quantity), 0) AS total_invested,
            (COALESCE(SUM(i.quantity), 0) / p.objective_quantity) * 100 AS progress_percentage
        ');
        $builder->join('investments i', 'i.pack_id = p.pack_id', 'left');
        $builder->groupBy('p.pack_id');

        return $builder->get()->getResult();
    }
}
