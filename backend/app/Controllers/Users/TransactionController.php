<?php

namespace App\Controllers\Users;
use App\Models\DepositModel;
use App\Models\PaymentModel;
use App\Models\WithdrawalModel;
use App\Models\TransactionModel;
use App\Models\InvestmentModel;
use App\Models\WalletModel;
use App\Models\NotificationModel;
use CodeIgniter\RESTful\ResourceController;

class TransactionController extends ResourceController
{
public function depositRequest()
{
    helper(['form']);
    $validation = \Config\Services::validation();
    $notificationModel = new NotificationModel();

    $rules = [
        'amount' => 'required|decimal',
        'payment_method' => 'required|in_list[bank,mobile_money,check]',
        'sender_number' => 'permit_empty',
        'proof_image' => 'permit_empty|uploaded[proof_image]|max_size[proof_image,2048]|is_image[proof_image]',
    ];

    if (!$this->validate($rules)) {
        return $this->failValidationErrors($validation->getErrors());
    }

    $user_id = $this->request->user_id;
    $amount = $this->request->getPost('amount');
    $method = $this->request->getPost('payment_method');
    $sender_number = $this->request->getPost('sender_number');
    $proof = null;

    // Gestion du fichier
    $file = $this->request->getFile('proof_image');
    if ($file && $file->isValid() && !$file->hasMoved()) {
        $proof = $file->getRandomName();
        $file->move(ROOTPATH . 'public/uploads/proofs', $proof);
    }

    $depositModel = new DepositModel();
    $deposit_id = $depositModel->insert([
        'user_id' => $user_id,
        'amount' => $amount,
        'payment_method' => $method,
        'sender_number' => $sender_number ?? null,
        'proof_image' => $proof,
        'status' => 'en attente',
    ]);

    if (!$deposit_id) {
        return $this->failServerError('Impossible de créer le dépôt.');
    }

    // Génération de la référence
    $reference = 'DEP-' . str_pad($deposit_id, 6, '0', STR_PAD_LEFT);
    $depositModel->update($deposit_id, ['reference' => $reference]);

    // Création de la transaction associée
    $transactionModel = new TransactionModel();
    $transactionModel->insert([
        'user_id' => $user_id,
        'amount' => $amount,
        'type' => 'deposit_request',
        'payment_method' => $method,
        'sender_number' => $sender_number ?? null,
        'proof_image' => $proof,
        'deposit_id' => $deposit_id,
        'status' => 'en attente',
        'reference' => $reference
    ]);

    $notificationModel->insert([
        'user_id' => $user_id,
        'title' => 'Nouveau dépôt en attente',
        'message' => 'Votre demande de dépôt de ' . number_format($amount, 0, ',', ' ') . ' Ar a été soumise et est en attente de validation.',
        'type' => 'info',
        'icon' => 'arrow-circle-down',
        'status_icon' => 'info-circle',
        'status_color' => '#fac115ff',
        'read' => 0,
    ]);

    return $this->respondCreated([
        'message' => 'Dépôt soumis avec succès et en attente de validation',
        'reference' => $reference
    ]);
}


public function paymentRequest()
{
    helper(['form']);
    $validation = \Config\Services::validation();
    $notificationModel = new NotificationModel();

    $rules = [
        'amount' => 'required|decimal',
        'payment_method' => 'required|in_list[wallet,bank,mobile_money,check]',
        'sender_number' => 'permit_empty',
        'proof_image' => 'required_if[payment_method,mobile_money]|if_exist|uploaded[proof_image]|max_size[proof_image,2048]|is_image[proof_image]',
        'pack_id' => 'required|integer',
        'product_id' => 'required|integer',
        'quantity' => 'required|integer'
    ];

    if (!$this->validate($rules)) {
        return $this->failValidationErrors($validation->getErrors());
    }

    $user_id = $this->request->user_id;
    $amount = $this->request->getPost('amount');
    $quantity = $this->request->getPost('quantity');
    $method = $this->request->getPost('payment_method');
    $sender_number = $this->request->getPost('sender_number');
    $pack_id = $this->request->getPost('pack_id');
    $product_id = $this->request->getPost('product_id');

    // Vérification pack
    $db = \Config\Database::connect();
    $builder = $db->table('packs p');
    $builder->select('p.objective_quantity, COALESCE(SUM(i.quantity),0) AS total_invested');
    $builder->join('investments i', 'i.pack_id = p.pack_id', 'left');
    $builder->where('p.pack_id', $pack_id);
    $builder->groupBy('p.pack_id');
    $pack = $builder->get()->getRow();

    if (!$pack) return $this->failNotFound("Pack introuvable.");

    $remaining_quantity = $pack->objective_quantity - $pack->total_invested;
    if ($remaining_quantity <= 0) return $this->fail("Objectif du pack atteint.");
    if ($quantity > $remaining_quantity) return $this->fail("Quantité demandée supérieure à disponible.");

    $proof = null;
    if ($this->request->getFile('proof_image') && $this->request->getFile('proof_image')->isValid()) {
        $file = $this->request->getFile('proof_image');
        $proof = $file->getRandomName();
        $file->move(ROOTPATH . 'public/uploads/proofs', $proof);
    }

    $status = ($method === 'wallet') ? 'validé' : 'en attente';

    if ($method === 'wallet') {
        $walletModel = new WalletModel();
        $wallet = $walletModel->where('user_id', $user_id)->first();
        if (!$wallet || $wallet['balance'] < $amount) return $this->fail('Fonds insuffisants.');
        $walletModel->update($wallet['wallet_id'], ['balance' => $wallet['balance'] - $amount]);
    }

    $paymentModel = new PaymentModel();
    $payment_id = $paymentModel->insert([
        'user_id' => $user_id,
        'amount' => $amount,
        'pack_id' => $pack_id,
        'product_id' => $product_id,
        'quantity' => $quantity,
        'payment_method' => $method,
        'sender_number' => $sender_number,
        'proof_image' => $proof,
        'status' => $status
    ]);

    $payment_reference = 'P-' . str_pad($payment_id, 6, '0', STR_PAD_LEFT);
    $paymentModel->update($payment_id, ['reference' => $payment_reference]);

    $notificationModel->insert([
        'user_id' => $user_id,
        'title' => 'Nouveau paiement ' . (($method === 'wallet') ? 'validé' : 'en attente'),
        'message' => ($method === 'wallet') ?
            'Votre paiement de ' . number_format($amount, 0, ',', ' ') . ' Ar via wallet a été validé et votre investissement a été enregistré.' :
            'Votre demande de paiement de ' . number_format($amount, 0, ',', ' ') . ' Ar a été soumise et est en attente de validation.',
        'type' => ($method === 'wallet') ? 'success' : 'info',
        'icon' => ($method === 'wallet') ? 'credit-card' : 'arrow-circle-down',
        'status_icon' => ($method === 'wallet') ? 'check-square-o' : 'info-circle',
        'status_color' => ($method === 'wallet') ? '#4ade80' : '#fac115ff',
        'read' => 0,
    ]);
    
    $investmentModel = new InvestmentModel();
    if ($method === 'wallet') {
        $existingInvestment = $investmentModel->where('user_id', $user_id)->where('pack_id', $pack_id)->first();

        if ($existingInvestment) {
            $investmentModel->update($existingInvestment['investment_id'], [
                'quantity' => $existingInvestment['quantity'] + $quantity,
                'total_amount' => $existingInvestment['total_amount'] + $amount
            ]);
            $reference = $existingInvestment['reference'];
        } else {
            $investment_id = $investmentModel->insert([
                'user_id' => $user_id,
                'pack_id' => $pack_id,
                'product_id' => $product_id,
                'quantity' => $quantity,
                'total_amount' => $amount,
                'payment_id' => $payment_id
            ]);
            $reference = 'IN-' . str_pad($investment_id, 6, '0', STR_PAD_LEFT);
            $investmentModel->update($investment_id, ['reference' => $reference]);
        }
    } else {
        $reference = null; 
    }

    $transactionModel = new TransactionModel();
    $transactionModel->insert([
        'user_id' => $user_id,
        'amount' => $amount,
        'type' => 'payment_request',
        'payment_method' => $method,
        'sender_number' => $sender_number,
        'proof_image' => $proof,
        'payment_id' => $payment_id,
        'status' => $status,
        'reference' => $payment_reference
    ]);

    return $this->respondCreated([
        'message' => ($method === 'wallet') ? 'Investissement payé et validé via wallet' : 'Demande de paiement enregistrée en attente',
        'reference' => $payment_reference,
    ]);
}



public function withdrawalRequest()
{
    helper(['form']);
    $validation = \Config\Services::validation();
    $notificationModel = new NotificationModel();

    $user_id = $this->request->user_id; 
    $amount = $this->request->getPost('amount');
    $method = $this->request->getPost('payment_method');
    $receiver_number = $this->request->getPost('receiver_number');

    $rules = [
        'amount' => 'required|decimal',
        'payment_method' => 'required|in_list[mobile_money]',
        'receiver_number' => 'required'
    ];

    if (!$this->validate($rules)) {
        return $this->failValidationErrors($validation->getErrors());
    }

    $walletModel = new WalletModel();
    $wallet = $walletModel->where('user_id', $user_id)->first();

    if (!$wallet || $wallet['balance'] < $amount) {
        return $this->fail('Solde insuffisant pour effectuer ce retrait.');
    }

    $withdrawalModel = new WithdrawalModel();
    $withdrawal_id = $withdrawalModel->insert([
        'user_id' => $user_id,
        'amount' => $amount,
        'receiver_number' => $receiver_number,
        'status' => 'en attente'
    ]);

    $reference = 'RET-' . str_pad($withdrawal_id, 6, '0', STR_PAD_LEFT);
    $withdrawalModel->update($withdrawal_id, ['reference' => $reference]);

    $transactionModel = new TransactionModel();
    $transactionModel->insert([
        'user_id' => $user_id,
        'amount' => $amount,
        'type' => 'withdrawal_request',
        'payment_method' => $method,
        'receiver_number' => $receiver_number,
        'withdrawal_id' => $withdrawal_id,
        'status' => 'en attente',
        'reference' => $reference
    ]);

    $notificationModel->insert([
        'user_id' => $user_id,
        'title' => 'Nouveau retrait en attente',
        'message' => 'Votre demande de retrait de ' . number_format($amount, 0, ',', ' ') . ' Ar a été soumise et est en attente de validation.',
        'type' => 'info',
        'icon' => 'arrow-circle-up',
        'status_icon' => 'info-circle',
        'status_color' => '#fac115ff',
        'read' => 0,
    ]);

    return $this->respondCreated([
        'message' => 'Retrait soumis avec succès et en attente de validation',
        'reference' => $reference
    ]);
}

    public function getTransactions()
    {
        $user_id = $this->request->user_id;

        if (!$user_id) {
            return $this->failUnauthorized('Utilisateur non authentifié.');
        }

        $transactionModel = new TransactionModel();
        $transactions = $transactionModel
            ->where('user_id', $user_id)
            ->orderBy('created_at', 'DESC')
            ->findAll();

        $data = [];

        foreach ($transactions as $t) {
            $data[] = [
                'id' => $t['transaction_id'],
                'type' => $t['type'],
                'amount' => $t['amount'],
                'status' => $t['status'] ?? 'en attente',
                'payment_method' => $t['payment_method'] ?? null,
                'sender_number' => $t['sender_number'] ?? null,
                'receiver_number' => $t['receiver_number'] ?? null,
                'date' => date('d-m-y', strtotime($t['created_at'])),
                'hour' => date('H:i', strtotime($t['created_at'])),
                'reference' => $t['reference']
            ];
        }

        return $this->respond([
            'status' => 'success',
            'transactions' => $data
        ]);
    }
}
