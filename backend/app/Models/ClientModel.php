<?php

namespace App\Models;

use CodeIgniter\Model;

class ClientModel extends Model
{
    protected $table            = 'clients';
    protected $primaryKey       = 'client_id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['first_name', 'last_name','adresse','contact'];

    protected bool $allowEmptyInserts = false;
    protected bool $updateOnlyChanged = true;

    protected array $casts = [];
    protected array $castHandlers = [];

    // Dates
    protected $useTimestamps = false;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules      = [
         'first_name'      => 'permit_empty',
        'last_name'   => 'permit_empty',
        'contact'  => 'required',
        'adresse'  => 'permit_empty',
    ];
    protected $validationMessages   = [
         'first_name'      => [
            'required'   => 'Le nom est requis.',
            // 'min_length' => 'Le nom doit comporter au moins 3 caractères.',
        ],
        'last_name'   => [
            'required'   => 'Le prénom est requis.',
            // 'min_length' => 'Le prénom doit comporter au moins 3 caractères.',
        ],
        'contact'  => [
            'required'   => 'Le contact est requis.',
            'numeric'    => 'Le contact doit être un numéro valide.',
            // 'min_length' => 'Le contact doit comporter au moins 10 chiffres.',
        ],
        'adresse'  => [
            'required'   => 'L\'adresse est requise.',
            'min_length' => 'L\'adresse doit comporter au moins 5 caractères.',
        ],
    ];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // Callbacks
    protected $allowCallbacks = true;
    protected $beforeInsert   = [];
    protected $afterInsert    = [];
    protected $beforeUpdate   = [];
    protected $afterUpdate    = [];
    protected $beforeFind     = [];
    protected $afterFind      = [];
    protected $beforeDelete   = [];
    protected $afterDelete    = [];
}
