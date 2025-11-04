<?php

namespace App\Controllers\Admin;

use App\Models\AdminModel;
use App\Models\UserModel;
use Firebase\JWT\JWT;
use CodeIgniter\RESTful\ResourceController;

class AuthController extends ResourceController
{
    protected $format = 'json';
    public function login()
    {
        $data = $this->request->getJSON(true);
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';


        $model = new AdminModel();
        $user = $model->where('email', $email)->first();

        if (!$user) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Email introuvable'
            ], 401);
        }

        if (!password_verify($password, $user['password'])) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Mot de passe incorrect'
            ], 401);
        }

        return $this->respond([
            'status' => 'ok',
            'message' => 'Connexion réussie',
            'token' => bin2hex(random_bytes(32)),
            'user' => $user
        ]);
    }
    public function create()
{
    $AdminModel = new AdminModel();

    // Get JSON sent from Postman
    $data = $this->request->getJSON(true);

    $insertData = [
        'name' => $data['name'] ?? null,
        'email' => $data['email'] ?? null,
        'password' => password_hash($data['password'], PASSWORD_DEFAULT),
    ];

    $AdminModel->insert($insertData);

    return $this->response->setJSON([
        'status' => 'success',
        'message' => 'Admin created successfully'
    ]);
}

    public function register()
    {
        $AdminModel = new AdminModel();

        $data = $this->request->getJSON(true);

        if (!isset($data['email']) || !isset($data['password']) || !isset($data['name'])) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Tous les champs sont requis'
            ], 400);
        }

        $existingUser = $AdminModel->where('email', $data['email'])->first();
        if ($existingUser) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Email déjà utilisé'
            ], 400);
        }

        $newUser = [
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => password_hash($data['password'], PASSWORD_DEFAULT)
        ];

        try {
            $AdminModel->insert($newUser);
            return $this->respond([
                'status' => 'success',
                'message' => 'Inscription réussie'
            ], 201);
        } catch (\Exception $e) {
            return $this->respond([
                'status' => 'error',
                'message' => 'Erreur lors de l\'inscription : ' . $e->getMessage()
            ], 500);
        }
    }
    public function logout(){
        session()->destroy();
        return $this->respond([
            'status' => 'success',
            'message' => 'Déconnexion réussie'
        ]);
    }
}
