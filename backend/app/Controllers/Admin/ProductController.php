<?php

namespace App\Controllers\Admin;

use App\Models\ProductModel;
use CodeIgniter\RESTful\ResourceController;

class ProductController extends ResourceController
{
    protected $modelName = ProductModel::class;
    protected $format    = 'json';

    public function index()
    {
        return $this->respond($this->model->findAll());
    }
    public function create()
    {
        helper(['form']);

        $validation = \Config\Services::validation();

    $validation->setRules([
        'name' => 'required',
        'description' => 'required',
        'unit_price' => 'required|numeric',
        'available_quantity' => 'required|integer',
        'image' => 'uploaded[image]|is_image[image]|mime_in[image,image/jpeg,image/png,image/jpg]',
        'reference' => 'required',
        'commission_rate' => 'required|integer'
    ]);

        if (!$validation->withRequest($this->request)->run()) {
            return $this->response->setJSON([
                'errors' => $validation->getErrors()
            ])->setStatusCode(400);
        }

        $file = $this->request->getFile('image');
        $newName = $file->getRandomName();
        $file->move(ROOTPATH . 'public/uploads/produits', $newName);

    $produitModel = new \App\Models\ProductModel();
    $produitModel->insert([
        'name' => $this->request->getPost('name'),
        'description' => $this->request->getPost('description'),
        'unit_price' => $this->request->getPost('unit_price'),
        'available_quantity' => $this->request->getPost('available_quantity'),
        'image_url' => 'uploads/produits/' . $newName,
        'commission_rate' => $this->request->getPost('commission_rate'),
        'reference' => $this->request->getPost('reference')
    ]);

        return $this->response->setJSON(['message' => 'Produit créé avec succès']);
    }

    public function options()
    {
        return $this->response
            ->setHeader('Access-Control-Allow-Origin', '*')
            ->setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            ->setHeader('Access-Control-Allow-Credentials', 'true')
            ->setStatusCode(200);
    }
public function update($id = null)
{
    $model = new ProductModel();

    // ⚡ Récupérer FormData PUT
    $data = $this->request->getPost(); // récupère FormData POST/PUT
    if (!$data) $data = $this->request->getRawInput(); // fallback JSON

    if (!$data) {
        return $this->failValidationErrors('Aucune donnée reçue');
    }
    if(isset($data['commission_rate'])){
    $data['commission_rate'] = (int)$data['commission_rate'];
}


    // Gestion de l'image
    $file = $this->request->getFile('image');
    if ($file && $file->isValid() && !$file->hasMoved()) {
        $newName = $file->getRandomName();
        $file->move(ROOTPATH . 'public/uploads/products', $newName);
        $data['image_url'] = 'uploads/products/' . $newName;
    }

    try {
        $model->update($id, $data);
        return $this->respond(['message' => 'Produit mis à jour avec succès']);
    } catch (\Exception $e) {
        return $this->failServerError($e->getMessage());
    }
}

public function updatePost($id = null)
{
    helper(['form']);

    $model = new ProductModel();

    // Récupérer les données FormData
    $data = $this->request->getPost();

    // Gestion de l'image
    $file = $this->request->getFile('image');
    if ($file && $file->isValid() && !$file->hasMoved()) {
        $newName = $file->getRandomName();
        $file->move(ROOTPATH . 'public/uploads/products', $newName);
        $data['image_url'] = 'uploads/products/' . $newName;
    }

    try {
        $model->update($id, $data);
        return $this->respond(['message' => 'Produit mis à jour avec succès']);
    } catch (\Exception $e) {
        return $this->failServerError($e->getMessage());
    }
}

    public function delete($id = null)
{
    $model = new ProductModel();

    if (!$id) {
        return $this->response->setJSON(['error' => 'ID manquant'])->setStatusCode(400);
    }

    $product = $model->find($id);
    if (!$product) {
        return $this->response->setJSON(['error' => 'Produit non trouvé'])->setStatusCode(404);
    }

    // Supprimer l'image du serveur si elle existe
    if (!empty($product['image_url']) && file_exists(ROOTPATH . 'public/' . $product['image_url'])) {
        unlink(ROOTPATH . 'public/' . $product['image_url']);
    }

    $model->delete($id);

    return $this->response->setJSON(['message' => 'Produit supprimé avec succès']);
}

}
