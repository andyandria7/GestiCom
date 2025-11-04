<?php
namespace App\Models;
use CodeIgniter\Model;

class WalletModel extends Model
{
    protected $table = 'wallets';
    protected $primaryKey = 'wallet_id';
    protected $allowedFields = ['user_id', 'balance'];
}