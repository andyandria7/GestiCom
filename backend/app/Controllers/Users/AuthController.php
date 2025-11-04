<?php

namespace App\Controllers\Users;

use App\Models\UserModel;
use App\Models\WalletModel;
use Firebase\JWT\JWT;
use CodeIgniter\RESTful\ResourceController;
use Firebase\JWT\Key;


class AuthController extends ResourceController
{
    protected $format = 'json';

    public function login()
    {
        $data = $this->request->getJSON(true);

        $email = strtolower(trim($data['email'] ?? null));
        $password = $data['password'] ?? null;

        
        if (!$email || !$password) {
            return $this->response->setJSON([
                'status' => false,
                'message' => 'Email ou mot de passe manquant'
            ]);
        }

        $userModel = new UserModel();
        $user = $userModel->where('email', $email)->first();

      
        if (!$user) {
            return $this->response->setJSON([
                'status' => false,
                'message' => 'Utilisateur introuvable'
            ]);
        }
        if (!password_verify($password, $user['password'])) {
            return $this->response->setJSON([
                'status' => false,
                'message' => 'Mot de passe incorrect'
            ]);
        }

        $payload = [
            'user_id' => $user['user_id'],
            'user' => $user,
            'iat' => time(),
            'exp' => time() + 10800,
        ];

        $token = JWT::encode($payload, getenv('JWT_SECRET'), 'HS256');

        return $this->respond([
            'status' => true,
            'message' => 'Connexion réussie',
            'token' => $token,
        ]);
    }


    public function register()
{
    $rules = [
        'first_name' => 'required',
        'last_name' => 'required',
        'phone_number' => 'permit_empty',
        'email' => 'required|valid_email|is_unique[users.email]',
        'date_of_birth' => 'required|valid_date',
        'password' => 'required|min_length[6]|max_length[100]',
        'confirm_password' => 'required|matches[password]',
        'role' => 'required|in_list[commercial,investor]',
    ];

    if (!$this->validate($rules)) {
        return $this->failValidationErrors($this->validator->getErrors());
    }

    $hashedPassword = password_hash($this->request->getVar('password'), PASSWORD_DEFAULT);

    $userModel = new UserModel();
    $userData = [
        'first_name'     => $this->request->getVar('first_name'),
        'last_name'      => $this->request->getVar('last_name'),
        'phone_number'   => $this->request->getVar('phone_number'),
        'email'          => $this->request->getVar('email'),
        'date_of_birth'  => $this->request->getVar('date_of_birth'),
        'password'       => $hashedPassword,
        'role'           => $this->request->getVar('role'),
    ];

    if (!$userModel->save($userData)) {
        return $this->response->setJSON([
            'status' => false,
            'message' => 'Erreur lors de l\'inscription. Veuillez réessayer.'
        ]);
    }

    
    $userId = $userModel->getInsertID();
    $userWallet = new WalletModel();
        $userWallet->insert(['user_id' => $userId]);
        

        $payload = [
            'user_id' => $userId,
            'user' => $userData,
            'iat' => time(),
            'exp' => time() + 10800,
        ];

    $token = JWT::encode($payload, getenv('JWT_SECRET'), 'HS256');

    return $this->respond([
        'status' => true,
        'message' => 'Inscription réussie',
        'token' => $token,
    ]);
}


    public function edit($id = null)
    {
        $header = $this->request->getHeaderLine('Authorization');
        $token = str_replace('Bearer ', '', $header);

        try {
            $decoded = JWT::decode($token, new Key(getenv('JWT_SECRET'), 'HS256'));
            $tokenUserId = $decoded->user_id ?? null;
        } catch (\Exception $e) {
            return $this->response->setJSON([
                'status' => false,
                'message' => 'Token invalide',
            ]);
        }

        if ($tokenUserId != $id) {
            return $this->response->setJSON([
                'status' => false,
                'message' => 'Vous n\'êtes pas autorisé à accéder à ce profil.',
            ]);
        }

        $userModel = new UserModel();
        $user = $userModel->find($id);

        return $this->respond([
            'status' => true,
            'user' => $user,
        ]);
    }


    public function update($id = null)
    {
        $header = $this->request->getHeaderLine('Authorization');
        $token = str_replace('Bearer ', '', $header);

        try {
            $decoded = JWT::decode($token, new Key(getenv('JWT_SECRET'), 'HS256'));
            $tokenUserId = $decoded->user_id ?? null;
        } catch (\Exception $e) {
            return $this->response->setJSON([
                'status' => false,
                'message' => 'Token invalide',
            ]);
        }

        if ($tokenUserId != $id) {
            return $this->response->setJSON([
                'status' => false,
                'message' => 'Vous n\'êtes pas autorisé à modifier ce profil.',
            ]);
        }

        $data = $this->request->getJSON(true);
        $userModel = new UserModel();

        $currentUser = $userModel->find($id);
        if (!$currentUser) {
            return $this->response->setJSON([
                'status' => false,
                'message' => 'Utilisateur introuvable.',
            ]);
        }

        if (!empty($data['password']) || !empty($data['new_password']) || !empty($data['confirm_password'])) {
            if (empty($data['password']) || empty($data['new_password']) || empty($data['confirm_password'])) {
                return $this->response->setJSON([
                    'status' => false,
                    'message' => 'Veuillez remplir tous les champs pour changer le mot de passe.',
                ]);
            }

            if (!password_verify($data['password'], $currentUser['password'])) {
                return $this->response->setJSON([
                    'status' => false,
                    'message' => 'Ancien mot de passe incorrect.',
                ]);
            }

            if ($data['new_password'] !== $data['confirm_password']) {
                return $this->response->setJSON([
                    'status' => false,
                    'message' => 'Le nouveau mot de passe et la confirmation ne correspondent pas.',
                ]);
            }

            if (strlen($data['new_password']) < 6) {
                return $this->response->setJSON([
                    'status' => false,
                    'message' => 'Le nouveau mot de passe doit contenir au moins 6 caractères.',
                ]);
            }

            $data['password'] = password_hash($data['new_password'], PASSWORD_DEFAULT);

            unset($data['new_password'], $data['confirm_password']);
        } else {
            unset($data['password']);
        }

        if (isset($data['email']) && $data['email'] === $currentUser['email']) {
            $userModel->setValidationRule('email', 'required|valid_email');
        }
        if (isset($data['email']) && $data['email'] !== $currentUser['email']) {
            $existingUser = $userModel->where('email', $data['email'])->first();
            if ($existingUser) {
                return $this->response->setJSON([
                    'status' => false,
                    'message' => 'Cet email est déjà utilisé.',
                ]);
            }
        }

        if (!$userModel->update($id, $data)) {
            return $this->response->setJSON([
                'status' => false,
                'message' => 'La mise à jour a échoué.',
                'errors' => $userModel->errors(),
            ]);
        }

        return $this->response->setJSON([
            'status' => true,
            'message' => 'Profil mis à jour avec succès.',
        ]);
    }

    public function uploadProfileImage($id = null)
    {
        helper(['form', 'url']);

        $userModel = new UserModel();

        $user = $userModel->find($id);
        if (!$user) {
            return $this->response->setJSON([
                'status' => false,
                'message' => 'Utilisateur introuvable.'
            ]);
        }

        $img = $this->request->getFile('profileImage');

        if (!$img || !$img->isValid()) {
            return $this->response->setJSON([
                'status' => false,
                'message' => 'Aucune image valide reçue.'
            ]);
        }

        $mimeType = $img->getMimeType();
        if (!in_array($mimeType, ['image/jpeg', 'image/png', 'image/gif', 'image/webp'])) {
            return $this->response->setJSON([
                'status' => false,
                'message' => 'Le fichier doit être une image (jpeg, png, gif, webp).'
            ]);
        }

        $newName = $img->getRandomName();
        $destination = ROOTPATH . 'public/uploads';

        if (!$img->move($destination, $newName)) {
            return $this->response->setJSON([
                'status' => false,
                'message' => 'Erreur lors du déplacement du fichier.'
            ]);
        }

        $host = getenv('APP_HOST') ?? base_url();
        $imageUrl = rtrim($host, '/') . '/uploads/' . $newName;

        $success = $userModel->update($id, ['profile_picture' => $imageUrl]);

        if (!$success) {
            log_message('error', "Échec de mise à jour pour l'utilisateur ID: {$id}");
            return $this->response->setJSON([
                'status' => false,
                'message' => 'Échec de la mise à jour de l\'image en base de données.'
            ]);
        }

        log_message('info', "Image de profil mise à jour pour l'utilisateur ID: {$id}");

        return $this->response->setJSON([
            'status' => true,
            'message' => 'Image uploadée et profil mis à jour avec succès.',
            'imageUrl' => $imageUrl
        ]);
    }

    public function uploadCINImage($id = null)
    {
        helper(['form', 'url']);
        $userModel = new UserModel();

        $img = $this->request->getFile('imgCIN');

        if (!$img || !$img->isValid()) {
            return $this->response->setJSON([
                'status' => false,
                'message' => 'Aucune image valide reçue.'
            ]);
        }

        $mimeType = $img->getMimeType();
        if (!in_array($mimeType, ['image/jpeg', 'image/png', 'image/gif', 'image/webp'])) {
            return $this->response->setJSON([
                'status' => false,
                'message' => 'Le fichier doit être une image (jpeg, png, gif, webp).'
            ]);
        }

        $newName = $img->getRandomName();
        $img->move(ROOTPATH . 'public/uploads', $newName);

        $imageUrl = getenv('APP_HOST') . '/uploads/' . $newName;

        if ($id) {
            $success = $userModel->update($id, ['CIN_picture' => $imageUrl]);
            if (!$success) {
                return $this->response->setJSON([
                    'status' => false,
                    'message' => 'Échec de mise à jour en base.'
                ]);
            }
        }

        return $this->response->setJSON([
            'status' => true,
            'imageUrl' => $imageUrl,
            'message' => 'Image CIN uploadée avec succès.'
        ]);
    }
}
