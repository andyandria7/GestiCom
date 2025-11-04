<?php

namespace App\Controllers\Deliveries;

use App\Models\ClientModel;
use App\Models\CommissionModel;
use App\Models\DeliveryModel;
use App\Models\ProductModel;
use App\Models\WalletModel;
use CodeIgniter\RESTful\ResourceController;

class DeliveryController extends ResourceController
{
    protected $modelName = DeliveryModel::class;
    protected $format = 'json';

    public function index()
    {
        $deliveryModel = new DeliveryModel();
        $clientModel = new ClientModel();
        $productModel = new ProductModel();

        $deliveries = $deliveryModel->findAll();

        $data = array_map(function ($delivery) use ($clientModel, $productModel) {
            $client = $clientModel->find($delivery['client_id']);
            $product = $productModel->find($delivery['product_id']);

            return [
                'delivery_id'   => $delivery['delivery_id'],
                'client'        => $client ? $client : null,
                'product'       => $product ? $product : null,
                'place'         => $delivery['place'],
                'delivery_date' => $delivery['delivery_date'],
                'quantity'      => $delivery['quantity'],
                'created_at'    => $delivery['created_at'],
                'updated_at'    => $delivery['updated_at'],
                'status'        => $delivery['status'],
            ];
        }, $deliveries);

        return $this->respond($data);
    }


    public function create()
{
    $data = $this->request->getJSON(true);

    if (!$data) {
        return $this->fail('No input data provided');
    }

    $validation = \Config\Services::validation();
    $validation->setRules([
        'client_id'     => 'required|integer',
        'product_id'    => 'required|integer',
        'user_id'       => 'required|integer',
        'place'         => 'required|string|max_length[255]',
        'delivery_date' => 'required|valid_date[Y-m-d H:i:s]',
        'quantity'      => 'required|integer|greater_than[0]',
    ]);

    if (!$validation->run($data)) {
        return $this->failValidationErrors($validation->getErrors());
    }

    $deliveryModel = $this->model;
    $productModel = new \App\Models\ProductModel();

    // Vérifier que le produit existe et qu'il y a assez de stock
    $product = $productModel->find($data['product_id']);
    if (!$product) {
        return $this->failNotFound('Produit introuvable');
    }
    if ($product['available_quantity'] < $data['quantity']) {
        return $this->failValidationErrors('Quantité disponible insuffisante');
    }

    // Créer la livraison
    $deliveryId = $deliveryModel->insert($data);
    if (!$deliveryId) {
        return $this->fail('Failed to create delivery');
    }

    // Décrémenter le stock du produit
    $newQuantity = $product['available_quantity'] - $data['quantity'];
    $productModel->update($data['product_id'], ['available_quantity' => $newQuantity]);

    return $this->respondCreated([
        'message' => 'Delivery created successfully',
        'delivery_id' => $deliveryId,
        'remaining_stock' => $newQuantity
    ]);
}

    public function delete($id = null)
    {
        $model = new DeliveryModel();

        if (!$id || !$model->find($id)) {
            return $this->response->setStatusCode(404)->setJSON([
                'status' => 'error',
                'message' => 'Livraison introuvable'
            ]);
        }

        if ($model->delete($id)) {
            return $this->response->setJSON([
                'status' => 'success',
                'message' => 'Livraison supprimée avec succès'
            ]);
        } else {
            return $this->response->setStatusCode(500)->setJSON([
                'status' => 'error',
                'message' => 'Erreur lors de la suppression'
            ]);
        }
    }

    public function validateDelivery($delivery_id)
{
    $deliveryModel = new DeliveryModel();
    $productModel = new ProductModel();
    $walletModel  = new WalletModel();
    $commissionModel = new CommissionModel();

    // Load delivery
    $delivery = $deliveryModel->find($delivery_id);
    if (!$delivery) {
        return $this->response->setStatusCode(404)->setJSON([
            'status' => 'error',
            'message' => 'Livraison introuvable'
        ]);
    }

    // Load product
    $product = $productModel->find($delivery['product_id'] ?? null);
    if (!$product) {
        return $this->response->setStatusCode(404)->setJSON([
            'status' => 'error',
            'message' => 'Produit introuvable pour cette livraison'
        ]);
    }

    // Safe numeric extraction
    $unitPrice = (float)($product['unit_price'] ?? 0);
    $quantity = (int)($delivery['quantity'] ?? 0);
    $commissionRate = (float)($product['commission_rate'] ?? 0);

    $commission = ($unitPrice * $quantity) * ($commissionRate / 100);

    try {
        // Insert commission record
        $commissionData = [
            'delivery_id' => $delivery_id,
            'user_id'     => $delivery['user_id'] ?? null,
            'amount'      => $commission,
            'status'      => 'paid'
        ];

        $commissionModel->insert($commissionData);

        // Update or create wallet
        $wallet = $walletModel->where('user_id', $delivery['user_id'])->first();

        if ($wallet) {
            $newBalance = (float)$wallet['balance'] + (float)$commission;
            $walletModel->update($wallet['wallet_id'], ['balance' => $newBalance]);
        } else {
            $walletModel->insert([
                'user_id' => $delivery['user_id'],
                'balance' => (float)$commission,
            ]);
        }

        // Mark delivery as validated
        $deliveryModel->update($delivery_id, ['status' => 'validated']);

        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'Livraison validée et commission versée.'
        ]);
    } catch (\Exception $e) {
        log_message('error', 'Error validating delivery id ' . $delivery_id . ': ' . $e->getMessage());

        return $this->response->setStatusCode(500)->setJSON([
            'status' => 'error',
            'message' => 'Erreur interne du serveur lors de la validation de la livraison',
            'detail'  => $e->getMessage()
        ]);
    }
}

}
