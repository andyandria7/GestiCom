<?php
namespace App\Controllers\Users;

use App\Models\PackModel;
use App\Models\ProductModel;
use CodeIgniter\RESTful\ResourceController;

class PackController extends ResourceController
{
    public function listPacks()
    {
        $db = \Config\Database::connect();
        $builder = $db->table('packs');
        
        $builder->select('
            packs.pack_id,
            packs.pack_name,
            packs.min_investment,
            packs.return_on_investment,
            packs.objective_quantity,
            products.product_id,
            products.name as product_name,
            products.image_url
        ');

        $builder->join('products', 'products.product_id = packs.product_id');
        
        $packs = $builder->get()->getResult();
    
        return $this->response->setJSON($packs);
    }


    public function showPack($id= null)
    {
        $db = \Config\Database::connect();
        $builder = $db->table('products');

        $builder->select('
            products.product_id,
            products.name as product_name,
            products.image_url,
            products.description,
            packs.objective_quantity,
            packs.pack_id,
            packs.pack_name,
            packs.min_investment,
            packs.return_on_investment
        ');

        $builder->join('packs', 'packs.product_id = products.product_id');
        $builder->where('packs.pack_id', $id);

        $product = $builder->get()->getRow();

        if ($product) {
            return $this->response->setJSON($product);
        } else {
            return $this->response->setStatusCode(404)->setJSON(['message' => 'Produit non trouvé']);
        }
    }

    public function create()
    {
        $productId = $this->request->getPost('product_id');
        $objectiveQty = $this->request->getPost('objective_quantity');
        $goal = $this->request->getPost('expected_goal');
        $roi = $this->request->getPost('return_on_investment');

        if (!$productId || !$objectiveQty || !$goal || !$roi) {
            return $this->response->setStatusCode(400)->setJSON(['error' => 'Champs requis manquants']);
        }

        $productModel = new ProductModel();
        $product = $productModel->find($productId);
        if (!$product) {
            return $this->response->setStatusCode(404)->setJSON(['error' => 'Produit introuvable']);
        }

        $packModel = new PackModel();

        $packData = [
            'product_id'         => $productId,
            'order_start_date'   => date('Y-m-d H:i:s'),
            'expected_goal'      => $goal,
            'min_investment'     => $product['unit_price'],
            'objective_quantity' => $objectiveQty,
            'return_on_investment' => $roi,
            'pack_name'          => ''
        ];

        $packModel->insert($packData);
        $id = $packModel->getInsertID();
        $packName = 'Pack ' . date('Y') . '-' . str_pad($id, 3, '0', STR_PAD_LEFT);
        $packModel->update($id, ['pack_name' => $packName]);

        return $this->response->setStatusCode(201)->setJSON(['message' => 'Pack créé', 'pack_id' => $id, 'pack_name' => $packName]);
    }

    public function update($id=null)
    {
        $packModel = new PackModel();
        $pack = $packModel->find($id);
        if (!$pack) {
            return $this->response->setStatusCode(404)->setJSON(['error' => 'Pack introuvable']);
        }

        $objectiveQty = $this->request->getPost('objective_quantity');
        $goal = $this->request->getPost('expected_goal');

        $data = [];
        if ($objectiveQty !== null) $data['objective_quantity'] = $objectiveQty;
        if ($goal !== null) $data['expected_goal'] = $goal;

        $packModel->update($id, $data);
        return $this->response->setJSON(['message' => 'Pack mis à jour']);
    }

    public function delete($id=null)
    {
        $packModel = new PackModel();
        $pack = $packModel->find($id);

        if (!$pack) {
            return $this->response->setStatusCode(404)->setJSON(['error' => 'Pack introuvable']);
        }

        $packModel->delete($id);
        return $this->response->setJSON(['message' => 'Pack supprimé']);
    }
}
