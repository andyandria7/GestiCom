<?php

namespace App\Models;

use CodeIgniter\Model;

class InvestmentModel extends Model
{
    protected $table = 'investments';
    protected $primaryKey = 'investment_id';

    protected $allowedFields = [
        'quantity',
        'total_amount',
        'investment_date',
        'user_id',
        'pack_id',
        'product_id',
        'reference',
        'created_at'
    ];
}
