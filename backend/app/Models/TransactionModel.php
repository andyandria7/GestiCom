<?php
namespace App\Models;
use CodeIgniter\Model;

class TransactionModel extends Model
{
    protected $table = 'transactions';
    protected $primaryKey = 'transaction_id';
    protected $allowedFields = [
        'user_id', 'amount', 'status', 'type', 'payment_method',
        'sender_number', 'receiver_number', 'proof_image',
        'deposit_id', 'withdrawal_id', 'payment_id', 'reference'
    ];
    
}
