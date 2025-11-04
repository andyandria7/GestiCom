<?php

namespace App\Controllers\Users;

use App\Models\ProductModel;
use CodeIgniter\RESTful\ResourceController;

class ProductController extends ResourceController
{
    public function index()
    {
        $model = new ProductModel();
        return $this->response->setJSON($model->findAll());
    }

    public function show($id = null)
    {
        $db = \Config\Database::connect();
        $builder = $db->table('products');

        $builder->select('
    products.product_id,
    products.name as product_name,
    products.image_url,
    products.unit_price,
    products.description,
    packs.objective_quantity,
    packs.pack_id,
    packs.pack_name,
    packs.min_investment,
    packs.return_on_investment
');

        $builder->join('packs', 'packs.product_id = products.product_id', 'left');
        $builder->where('products.product_id', $id);

        $product = $builder->get()->getRow();


        if ($product) {
            return $this->response->setJSON($product);
        } else {
            return $this->response->setStatusCode(404)->setJSON(['message' => 'Produit non trouvé']);
        }
    }

    public function create()
    {
        $productModel = new ProductModel();
        $image = $this->request->getFile('image');


        if ($image && $image->isValid()) {
            $imageName = $image->getRandomName();
            $image->move('uploads/products', $imageName);
            $image_url = '/uploads/products/' . $imageName;
        } else {
            return $this->response->setStatusCode(400)->setJSON(['error' => 'Image invalide']);
        }

        $data = [
            'name' => $this->request->getPost('name'),
            'unit_price' => $this->request->getPost('unit_price'),
            'available_quantity' => $this->request->getPost('available_quantity'),
            'description' => $this->request->getPost('description'),
            'image_url' => $image_url
        ];

        $productModel->insert($data);
        return $this->response->setJSON(['message' => 'Produit créé avec succès']);
    }

    public function update($id = null)
    {
        $productModel = new ProductModel();
        $product = $model->find($id);
        if (!$product) return $this->response->setStatusCode(404)->setJSON(['error' => 'Produit non trouvé']);

        $image = $this->request->getFile('image');
        $image_url = $product['image_url'];

        if ($image && $image->isValid()) {
            $imageName = $image->getRandomName();
            $image->move('uploads/products', $imageName);
            $image_url = '/uploads/products/' . $imageName;
        }

        $data = [
            'name' => $this->request->getPost('name'),
            'unit_price' => $this->request->getPost('unit_price'),
            'available_quantity' => $this->request->getPost('available_quantity'),
            'description' => $this->request->getPost('description'),
            'image_url' => $image_url
        ];

        $productModel->update($id, $data);
        return $this->response->setJSON(['message' => 'Produit mis à jour']);
    }

    public function delete($id = null)
    {
        $model = new ProductModel();
        if (!$model->find($id)) return $this->response->setStatusCode(404)->setJSON(['error' => 'Produit introuvable']);
        $model->delete($id);
        return $this->response->setJSON(['message' => 'Produit supprimé']);
    }
}
// <?php namespace App\Controllers;

// use App\Models\ProductModel;
// use CodeIgniter\RESTful\ResourceController;

// class ProductController extends ResourceController
// {
//     protected $modelName = ProductModel::class;
//     protected $format    = 'json';

//     public function index()
//     {
//         return $this->respond($this->model->findAll());
//     }

//     public function create()
//     {
//         helper(['form']);
    
//         $validation = \Config\Services::validation();
    
//         $validation->setRules([
//             'name' => 'required',
//             'description' => 'required',
//             'unit_price' => 'required|numeric',
//             'available_quantity' => 'required|integer',
//             'image' => 'uploaded[image]|is_image[image]|mime_in[image,image/jpeg,image/png,image/jpg]'
//         ]);
    
//         if (!$validation->withRequest($this->request)->run()) {
//             return $this->response->setJSON([
//                 'errors' => $validation->getErrors()
//             ])->setStatusCode(400);
//         }
    
//         $file = $this->request->getFile('image');
//         $newName = $file->getRandomName();
//         $file->move(ROOTPATH . 'public/uploads/products', $newName);
    
//         $produitModel = new \App\Models\ProductModel();
//         $produitModel->insert([
//             'name' => $this->request->getPost('name'),
//             'description' => $this->request->getPost('description'),
//             'unit_price' => $this->request->getPost('unit_price'),
//             'available_quantity' => $this->request->getPost('available_quantity'),
//             'image_url' => 'uploads/products/' . $newName
//         ]);
    
//         return $this->response->setJSON(['message' => 'Produit créé avec succès']);
//     }
    
    
    

//     public function options()
//     {
//         return $this->response
//             ->setHeader('Access-Control-Allow-Origin', '*')
//             ->setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
//             ->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
//             ->setHeader('Access-Control-Allow-Credentials', 'true')
//             ->setStatusCode(200);
//     }
//     public function update($id = null)
// {
//     helper(['form', 'url']);
//     $model = new productModel();

//     $data = [
//         'name' => $this->request->getPost('name'),
//         'description' => $this->request->getPost('description'),
//         'unit_price' => $this->request->getPost('unit_price'),
//         'available_quantity' => $this->request->getPost('available_quantity')
//     ];

//     if ($img = $this->request->getFile('image')) {
//         if ($img->isValid() && !$img->hasMoved()) {
//             $imageName = $img->getRandomName();
//             $img->move('uploads/', $imageName);
//             $data['image_url'] = 'uploads/' . $imageName;
//         }
//     }

//     $model->update($id, $data);
//     return $this->response->setJSON(['message' => 'Produit mis à jour avec succès']);
// }
// public function decrementQuantity($id)
// {
//     $data = $this->request->getJSON(true);

//     if (!isset($data['decrement_quantity'])) {
//         return $this->failValidationError("Champ 'decrement_quantity' requis.");
//     }

//     $productModel = new ProductModel();
//     $product = $productModel->find($id);

//     if (!$product) {
//         return $this->failNotFound("Produit introuvable.");
//     }

//     $newQty = $product['available_quantity'] - (int) $data['decrement_quantity'];

//     if ($newQty < 0) {
//         return $this->failValidationError("Quantité insuffisante.");
//     }

//     $productModel->update($id, ['available_quantity' => $newQty]);

//     return $this->respond([
//         'message' => 'Quantité décrémentée avec succès',
//         'available_quantity' => $newQty,
//     ]);
// }
// }
