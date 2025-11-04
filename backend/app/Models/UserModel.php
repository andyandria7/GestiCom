<?php
namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table = 'users';
    protected $primaryKey = 'user_id';
    protected $allowedFields = [
        'first_name', 
        'last_name', 
        'phone_number', 
        'email', 
        'date_of_birth', 
        'CIN_picture', 
        'profile_picture', 
        'password',  
        'role',
        'created_at',
        'updated_at',
        'status'

    ];
    protected $returnType = 'array';
    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    // Avant insertion => forcer un status par défaut
    protected $beforeInsert = ['setDefaultStatus'];

    protected function setDefaultStatus(array $data)
    {
        if (! isset($data['data']['status'])) {
            $data['data']['status'] = 0; // false par défaut
        }
        return $data;
    }

    // Ajout de règles de validation
    protected $validationRules = [
        'first_name'     => 'required',
        'last_name'      => 'required',
        'email'          => 'required|valid_email|is_unique[users.email]',
        'password'       => 'required|min_length[6]',
        'phone_number'   => 'permit_empty',
        'date_of_birth'  => 'permit_empty',
        'role'           => 'required|in_list[commercial,investor]',
        'status'         => 'permit_empty|in_list[0,1]', // validation si fourni
    ];

    protected $validationMessages = [
        'email' => [
            'is_unique'   => 'Cet email est déjà utilisé.',
            'valid_email' => 'Format d\'email invalide.',
        ],
        'password' => [
            'min_length' => 'Le mot de passe doit contenir au moins 6 caractères.',
        ],
        'role' => [
            'in_list' => 'Le rôle doit être commercial ou investisseur.',
        ],
    ];

    protected $skipValidation = false;
}
