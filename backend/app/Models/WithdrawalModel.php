<?php
namespace App\Models;

use CodeIgniter\Model;

class WithdrawalModel extends Model
{
    protected $table = 'withdrawals';
    protected $primaryKey = 'withdrawal_id';
    protected $allowedFields = ['user_id', 'amount', 'receiver_number', 'payment_method', 'status','reference'];

}
