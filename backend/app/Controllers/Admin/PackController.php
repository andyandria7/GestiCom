<?php

namespace App\Controllers\Admin;

use App\Models\PackModel;
use App\Models\ProductModel;
use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\HTTP\ResponseInterface;

class PackController extends ResourceController
{
    protected $modelName = PackModel::class;
    protected $format    = 'json';

    public function index()
{
    $packs = $this->model->findAll();
    $produitModel = new ProductModel();

   foreach ($packs as &$pack) {
    if (!empty($pack['product_id'])) {
        $prod = $produitModel->find((int)$pack['product_id']);
        if ($prod) {
            $pack['product'] = [
                'id' => $prod['product_id'], // attention à la clé primaire
                'name' => $prod['name'],
                'image_url' => $prod['image_url'] ?? null,
                'unit_price' => $prod['unit_price'] ?? null,
            ];
        } else {
            $pack['product'] = null;
        }
    } else {
        $pack['product'] = null;
    }
}
    return $this->respond($packs, 200);
}


 public function show($id = null)
{
    $pack = $this->model->find($id);
    if (!$pack) return $this->failNotFound('Pack introuvable');

    $produitModel = new ProductModel();
    $prod = $produitModel->find((int)$pack['product_id']); 
    if ($prod) {
        $pack['product'] = [
            'id' => $prod['product_id'], 
            'name' => $prod['name'],
            'image_url' => $prod['image_url'] ?? null,
            'unit_price' => $prod['unit_price'] ?? null,
            'description' => $prod['description'] ?? "Pas de description disponible"
        ];
        $pack['objective_amount'] = ((float) $prod['unit_price']) * ((int) $pack['objective_quantity']);
    } else {
        $pack['product'] = null; 
    }

    return $this->respond($pack, 200);
}

    public function create()
{
    helper(['form']);

    $raw = null;
    $contentType = strtolower($this->request->getHeaderLine('Content-Type'));

    try {
        if (strpos($contentType, 'application/json') !== false) {
            $raw = $this->request->getJSON(true);
        }
    } catch (\Throwable $e) {
        return $this->respond(
            ['error' => 'Invalid JSON payload', 'details' => $e->getMessage()],
            ResponseInterface::HTTP_BAD_REQUEST
        );
    }
    if ($raw === null) {
        $raw = $this->request->getPost();
    }

    $normalized = [
        'product_id' => $raw['product_id'] ?? null,
        'pack_name' => $raw['pack_name'] ?? $raw['name'] ?? null,
        'order_start_date' => $raw['order_start_date'] ?? $raw['start_date'] ?? date('Y-m-d'),
        'min_investment' => $this->normalizeNumberString($raw['min_investment'] ?? 0),
        'return_on_investment' => $this->normalizeNumberString($raw['return_on_investment'] ?? 0),
        'objective_quantity' => (int)($raw['objective_quantity'] ?? 0),
    ];

    $produitModel = new ProductModel();
    $produit = $produitModel->find((int)$normalized['product_id']);
    if (!$produit) {
        return $this->respond(
            ['errors' => ['product_id' => 'Produit inexistant']],
            ResponseInterface::HTTP_BAD_REQUEST
        );
    }

    // Vérifier le stock dispo
    if ($normalized['objective_quantity'] > $produit['available_quantity']) {
        return $this->respond(
            ['errors' => ['objective_quantity' => "Stock insuffisant. Disponible : " . $produit['available_quantity']]],
            ResponseInterface::HTTP_BAD_REQUEST
        );
    }

    // Préparer les données
    $filtered = [
        'product_id' => (int)$normalized['product_id'],
        'pack_name' => $normalized['pack_name'],
        'order_start_date' => $normalized['order_start_date'],
        'min_investment' => (float)$normalized['min_investment'],
        'objective_quantity' => (int)$normalized['objective_quantity'],
        'return_on_investment' => (float)$normalized['return_on_investment'],
        'objective_amount' => (float)$produit['unit_price'] * (int)$normalized['objective_quantity'],
    ];

    // Règle métier
    if ($filtered['min_investment'] > $filtered['objective_amount']) {
        return $this->respond(
            ['errors' => ['min_investment' => "L'investissement minimum ne doit pas dépasser l'objectif."]],
            ResponseInterface::HTTP_BAD_REQUEST
        );
    }

    // Insertion pack
    try {
        $id = $this->model->insert($filtered);
    } catch (\Throwable $e) {
        return $this->respond(
            ['error' => 'Insertion échouée', 'details' => $e->getMessage()],
            ResponseInterface::HTTP_BAD_REQUEST
        );
    }

    // Décrémentation du stock produit
    $produitModel->update($produit['product_id'], [
        'available_quantity' => $produit['available_quantity'] - $filtered['objective_quantity']
    ]);

    $pack = $this->model->find($id);
    return $this->respondCreated($pack);
}


public function update($id = null)
{
    helper(['form']);

    if ($id === null) {
        return $this->failValidationErrors('Identifiant manquant');
    }

    $existing = $this->model->find($id);
    if (!$existing) {
        return $this->failNotFound('Pack introuvable');
    }

    $raw = null;
    $contentType = strtolower($this->request->getHeaderLine('Content-Type'));
    try {
        if (strpos($contentType, 'application/json') !== false) {
            $raw = $this->request->getJSON(true);
        }
    } catch (\Throwable $e) {
        return $this->respond(
            ['error' => 'Invalid JSON payload', 'details' => $e->getMessage()],
            ResponseInterface::HTTP_BAD_REQUEST
        );
    }
    if ($raw === null) {
        $raw = $this->request->getPost();
    }

    // Normalisation
    $normalized = [
        'product_id' => $raw['product_id'] ?? $existing['product_id'],
        'pack_name' => $raw['pack_name'] ?? $existing['pack_name'],
        'order_start_date' => $raw['order_start_date'] ?? $existing['order_start_date'],
        'min_investment' => $raw['min_investment'] ?? $existing['min_investment'],
        'objective_quantity' => $raw['objective_quantity'] ?? $existing['objective_quantity'],
        'return_on_investment' => $raw['return_on_investment'] ?? $existing['return_on_investment'],
    ];

    // Vérification du produit
    $produitModel = new ProductModel();
    $produit = $produitModel->find((int)$normalized['product_id']);
    if (!$produit) {
        return $this->respond(
            ['errors' => ['product_id' => 'Produit inexistant']],
            ResponseInterface::HTTP_BAD_REQUEST
        );
    }

    // 🔥 1️⃣ Calcul de la différence de quantité
    $oldQty = (int)$existing['objective_quantity'];
    $newQty = (int)$normalized['objective_quantity'];
    $difference = $newQty - $oldQty;

    // 🔥 2️⃣ Ajustement du stock
    $newAvailable = (int)$produit['available_quantity'] - $difference;
    if ($newAvailable < 0) {
        return $this->respond(
            ['errors' => ['objective_quantity' => "Stock insuffisant. Disponible : {$produit['available_quantity']}"]],
            ResponseInterface::HTTP_BAD_REQUEST
        );
    }

    // 🔥 3️⃣ Mettre à jour le produit
    $produitModel->update($produit['product_id'], [
        'available_quantity' => $newAvailable
    ]);

    // 🔥 4️⃣ Mettre à jour le pack
    $normalized['objective_amount'] = (float)$produit['unit_price'] * $newQty;
    $this->model->update($id, $normalized);

    $pack = $this->model->find($id);
    return $this->respondUpdated([
        'message' => 'Pack mis à jour avec succès ✅',
        'pack' => $pack
    ]);
}
    public function delete($id = null)
    {
        $pack = $this->model->find($id);
        if (!$pack) {
            return $this->failNotFound('Pack introuvable');
        }
        $this->model->delete($id);
        return $this->respondDeleted(['message' => 'Pack supprimé']);
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

    // Helpers de normalisation
    protected function normalizeNumberString($value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }
        if (is_numeric($value)) {
            return (string) $value;
        }
        // Remplace la virgule décimale par un point puis nettoie
        $s = (string) $value;
        $s = str_replace(',', '.', $s);
        // Supprime les espaces et autres séparateurs non numériques (conserve . et -)
        $clean = preg_replace('/[^\d\.\-]/', '', $s);
        if ($clean === '') return null;
        // Si plusieurs points, garder seulement le dernier comme séparateur décimal
        $dotCount = substr_count($clean, '.');
        if ($dotCount > 1) {
            $lastDotPos = strrpos($clean, '.');
            $left = substr($clean, 0, $lastDotPos);
            $left = str_replace('.', '', $left);
            $right = substr($clean, $lastDotPos + 1);
            $clean = $left . '.' . $right;
        }
        return $clean;
    }

    protected function normalizeBoolInt($value): ?string
    {
        if ($value === null || $value === '') return null;
        $v = strtolower((string) $value);
        if (in_array($v, ['1','true','on','yes','oui'], true)) return '1';
        if (in_array($v, ['0','false','off','no','non'], true)) return '0';
        // Si valeur inattendue, on laisse null pour laisser la validation décider
        return null;
    }

    protected function normalizeDateYmd($value): ?string
    {
        if ($value === null || $value === '') return null;
        try {
            $dt = new \DateTime((string) $value);
            return $dt->format('Y-m-d');
        } catch (\Throwable $e) {
            return null; // laisser la validation ou la valeur par défaut gérer
        }
    }
    public function store()
{
    $rules = [
        'pack_name'          => 'required',
        'min_investment'     => 'required|numeric',
        'unit_price'         => 'required|numeric',
        'objective_quantity' => 'required|numeric',
        'produits_id'        => 'required|numeric',
    ];

    if (!$this->validate($rules)) {
        return $this->response->setStatusCode(400)->setJSON([
            'error' => $this->validator->getErrors()
        ]);
    }

    $data = $this->request->getJSON(true);

    $produitModel = new ProductModel();
    $produit = $produitModel->find((int)$data['produits_id']);

    if (!$produit) {
        return $this->response->setStatusCode(404)->setJSON([
            'error' => "Produit introuvable"
        ]);
    }

    if ($data['objective_quantity'] > $produit['available_quantity']) {
        return $this->response->setStatusCode(400)->setJSON([
            'error' => "Stock insuffisant. Disponible: {$produit['available_quantity']}"
        ]);
    }

    if ($data['min_investment'] >= $data['unit_price']) {
        return $this->response->setStatusCode(400)->setJSON([
            'error' => "L'investissement minimum doit être inférieur au prix unitaire."
        ]);
    }

    $data['objectif'] = $data['unit_price'] * $data['objective_quantity'];

    $packModel = new PackModel();
    $packModel->insert($data);

    // Décrémenter le stock produit
    $produitModel->update($produit['produit_id'], [
        'available_quantity' => $produit['available_quantity'] - $data['objective_quantity']
    ]);

    return $this->response->setJSON([
        'message' => "Pack créé avec succès ✅",
        'data' => $data
    ]);
}
}
