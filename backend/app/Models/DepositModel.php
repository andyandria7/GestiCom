<?php
namespace App\Models;

use CodeIgniter\Model;

class DepositModel extends Model
{
    protected $table = 'deposits';
    protected $primaryKey = 'deposit_id';
    protected $allowedFields = ['user_id', 'amount', 'payment_method', 'sender_number', 'proof_image', 'status','reference'];
}
