<?php namespace App\Models;

use CodeIgniter\Model;

class RetraitModel extends Model
{
    protected $table = 'retraits';
    protected $allowedFields = ['utilisateur', 'montant', 'date'];
}
