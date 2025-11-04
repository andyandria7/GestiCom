<?php
namespace App\Models;

use CodeIgniter\Model;

class PaymentModel extends Model
{
    protected $table = 'payments';
    protected $primaryKey = 'payment_id';
    protected $allowedFields = ['user_id', 'amount','quantity', 'pack_id', 'product_id', 'payment_method', 'sender_number', 'proof_image', 'status', 'reference'];
}
