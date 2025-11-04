<?php

namespace App\Controllers\Admin;

use App\Models\DepositModel;
use App\Models\WithdrawalModel;
use App\Models\PaymentModel;
use App\Models\InvestmentModel;
use App\Models\WalletModel;
use App\Models\TransactionModel;
use App\Models\NotificationModel;
use CodeIgniter\RESTful\ResourceController;

class PaymentsAPI extends ResourceController
{
    protected $format = 'json';

    public function showDeposits()
    {
        $depositModel = new DepositModel();
        $deposits = $depositModel
            ->select('deposits.deposit_id, deposits.amount, deposits.payment_method, deposits.sender_number, deposits.proof_image, deposits.status, deposits.created_at, deposits.reference, users.user_id, users.first_name, users.last_name, users.email')
            ->join('users', 'users.user_id = deposits.user_id')
            ->orderBy('deposits.created_at', 'DESC')
            ->findAll();

        return $this->respond($deposits);
    }

    public function showWithdrawals()
    {
        $withdrawalModel = new WithdrawalModel();
        $withdrawals = $withdrawalModel
            ->select('withdrawals.withdrawal_id, withdrawals.amount, withdrawals.payment_method, withdrawals.receiver_number, withdrawals.status, withdrawals.created_at, withdrawals.reference, users.user_id, users.first_name, users.last_name, users.email')
            ->join('users', 'users.user_id = withdrawals.user_id')
            ->orderBy('withdrawals.created_at', 'DESC')
            ->findAll();

        return $this->respond($withdrawals);
    }

    public function showPayments()
    {
        $paymentModel = new PaymentModel();
        $payments = $paymentModel
            ->select('payments.payment_id, payments.amount, payments.payment_method, payments.sender_number, payments.proof_image, payments.status, payments.created_at,payments.reference, users.user_id, users.first_name, users.last_name, users.email')
            ->join('users', 'users.user_id = payments.user_id')
            ->where('payments.payment_method !=', 'wallet')
            ->orderBy('payments.created_at', 'DESC')
            ->findAll();

        return $this->respond($payments);
    }

     public function validateDeposit($id)
    {
        $depositModel = new DepositModel();
        $walletModel = new WalletModel();
        $transactionModel = new TransactionModel();
        $notificationModel = new NotificationModel();

        $deposit = $depositModel->find($id);
        if (!$deposit) return $this->failNotFound("Dépôt introuvable");
        if ($deposit['status'] !== 'en attente') return $this->fail("Ce dépôt est déjà traité");

        $wallet = $walletModel->where('user_id', $deposit['user_id'])->first();
        if (!$wallet) return $this->failNotFound("Portefeuille introuvable");

        $walletModel->update($wallet['wallet_id'], [
            'balance' => $wallet['balance'] + $deposit['amount']
        ]);

        $depositModel->update($id, ['status' => 'validé']);
        $transactionModel->where('deposit_id', $id)->set(['status' => 'validé'])->update();

        $notificationModel->insert([
            'user_id' => $deposit['user_id'],
            'title' => 'Dépôt validé',
            'message' => 'Votre demande de dépôt de ' . number_format($deposit['amount'], 0, ',', ' ') . ' Ar a été validée.',
            'type' => 'success',
            'icon' => 'arrow-circle-down',
            'status_icon' => 'check-square-o',
            'status_color' => '#4ade80',
            'read' => 0,
        ]);

        return $this->respond([
            'message' => 'Dépôt validé et solde mis à jour',
            'new_balance' => $wallet['balance'] + $deposit['amount']
        ]);
    }

    public function rejectDeposit($id)
    {
        $depositModel = new DepositModel();
        $transactionModel = new TransactionModel();
        $notifications = new NotificationModel();

        $deposit = $depositModel->find($id);
        if (!$deposit) return $this->failNotFound("Dépôt introuvable");

        $depositModel->update($id, ['status' => 'rejeté']);
        $transactionModel->where('deposit_id', $id)->set(['status' => 'rejeté'])->update();

        $notifications->insert([
            'user_id' => $withdrawal['user_id'],
            'title' => 'Dépôt rejeté',
            'message' => 'Votre demande de dépôt de ' . number_format($deposit['amount'], 0, ',', ' ') . ' Ar a été rejetée.',
            'type' => 'error',
            'icon' => 'arrow-circle-down',
            'status_icon' => 'times-circle',
            'status_color' => '#ef4444',
            'read' => 0,
        ]);

        return $this->respond(['message' => 'Dépôt rejeté']);
    }

    public function validateWithdrawal($id)
    {
        $withdrawalModel = new WithdrawalModel();
        $walletModel = new WalletModel();
        $transactionModel = new TransactionModel();
        $notifications = new NotificationModel();

        $withdrawal = $withdrawalModel->find($id);
        if (!$withdrawal) return $this->failNotFound("Retrait introuvable");
        if ($withdrawal['status'] !== 'en attente') return $this->fail("Ce retrait est déjà traité");

        $wallet = $walletModel->where('user_id', $withdrawal['user_id'])->first();
        if (!$wallet) return $this->failNotFound("Portefeuille introuvable");

        $walletModel->update($wallet['wallet_id'], [
            'balance' => $wallet['balance'] - $withdrawal['amount']
        ]);

        $withdrawalModel->update($id, ['status' => 'validé']);
        $transactionModel->where('withdrawal_id', $id)->set(['status' => 'validé'])->update();

        $notifications->insert([
            'user_id' => $withdrawal['user_id'],
            'title' => 'Retrait validé',
            'message' => 'Votre demande de retrait de ' . number_format($withdrawal['amount'], 0, ',', ' ') . ' Ar a été validée.',
            'type' => 'success',
            'icon' => 'arrow-circle-up',
            'status_icon' => 'check-square-o',
            'status_color' => '#4ade80',
            'read' => 0,
        ]);

        return $this->respond(['message' => 'Retrait validé']);
    }

    public function rejectWithdrawal($id)
    {
        $withdrawalModel = new WithdrawalModel();
        $transactionModel = new TransactionModel();
        $notifications = new NotificationModel();

        $withdrawal = $withdrawalModel->find($id);

        $withdrawalModel->update($id, ['status' => 'rejeté']);
        $transactionModel->where('withdrawal_id', $id)->set(['status' => 'rejeté'])->update();

        $notifications->insert([
            'user_id' => $withdrawal['user_id'],
            'title' => 'Retrait rejeté',
            'message' => 'Votre demande de retrait de ' . number_format($withdrawal['amount'], 0, ',', ' ') . ' Ar a été rejetée.',
            'type' => 'error',
            'icon' => 'warning',
            'status_icon' => 'times-circle',
            'status_color' => '#ef4444',
            'read' => 0,
        ]);

        return $this->respond(['message' => 'Retrait rejeté et fonds recrédités']);
    }

    public function validatePayment($payment_id)
    {
        $paymentModel = new PaymentModel();
        $investmentModel = new InvestmentModel();
        $walletModel = new WalletModel();
        $transactionModel = new TransactionModel();
        $notifications = new NotificationModel();

        $payment = $paymentModel->find($payment_id);
        $paymentModel->update($payment_id, ['status' => 'validé']);
        
        $notifications->insert([
            'user_id' => $payment['user_id'],
            'title' => 'Paiement validé',
            'message' => 'Votre paiement de ' . number_format($payment['amount'], 0, ',', ' ') . ' Ar a été validé.',
            'type' => 'success',
            'icon' => 'credit-card',
            'status_icon' => 'check-square-o',
            'status_color' => '#4ade80',
            'read' => 0,
        ]);

        $existingInvestment = $investmentModel
            ->where('user_id', $payment['user_id'])
            ->where('pack_id', $payment['pack_id'])
            ->first();

        if ($existingInvestment) {
            $newQuantity = $existingInvestment['quantity'] + $payment['quantity'];
            $newAmount = $existingInvestment['total_amount'] + $payment['amount'];

            $investmentModel->update($existingInvestment['investment_id'], [
                'quantity' => $newQuantity,
                'total_amount' => $newAmount,
                'created_at' => date('Y-m-d H:i:s')
            ]);

            $investment_reference = 'IN-' . str_pad($existingInvestment['investment_id'], 6, '0', STR_PAD_LEFT);
            $investmentModel->update($existingInvestment['investment_id'], ['reference' => $investment_reference]);

        } else {
            $investment_id = $investmentModel->insert([
                'user_id' => $payment['user_id'],
                'pack_id' => $payment['pack_id'],
                'quantity' => $payment['quantity'],
                'product_id' => $payment['product_id'],
                'total_amount' => $payment['amount'],
                'created_at' => date('Y-m-d H:i:s')
            ]);

            $investment_reference = 'IN-' . str_pad($investment_id, 6, '0', STR_PAD_LEFT);
            $investmentModel->update($investment_id, ['reference' => $investment_reference]);
        }

        $transactionModel->where('payment_id', $payment_id)->set(['status' => 'validé'])->update();

        return $this->respond([
            'message' => 'Paiement validé et investissement créé/mis à jour',
            'reference' => $investment_reference
        ]);
    }


    public function rejectPayment($payment_id)
    {
        $paymentModel = new PaymentModel();
        $transactionModel = new TransactionModel();
        $notifications = new NotificationModel(); 

        $payment = $paymentModel->find($payment_id);
        if (!$payment) {
            return $this->failNotFound("Paiement introuvable");
        }

        $paymentModel->update($payment_id, ['status' => 'rejeté']);
        $transactionModel->where('payment_id', $payment_id)->set(['status' => 'rejeté'])->update();

        $notifications->insert([
            'user_id' => $payment['user_id'],
            'title' => 'Paiement rejeté',
            'message' => 'Votre paiement de ' . number_format($payment['amount'], 0, ',', ' ') . ' Ar a été rejeté.',
            'type' => 'error',
            'icon' => 'credit-card',
            'status_icon' => 'times-circle',
            'status_color' => '#ef4444',
            'read' => 0,
        ]);

        return $this->respond([
            'message' => "Paiement rejeté avec succès. ",
        ]);
    }
    
    public function getNotifications()
    {
        $user_id = $this->request->user_id;

        $notificationsModel = new NotificationModel();
        $notifications = $notificationsModel
            ->where('user_id', $user_id)
            ->orderBy('created_at', 'DESC')
            ->findAll();

        return $this->response->setJSON($notifications);
    }

    public function markAllRead()
    {
        $user_id = $this->request->user_id;

        $notificationsModel = new NotificationModel();

        $notifications = $notificationsModel
            ->where('user_id', $user_id)
            ->set('read', 1)
            ->update();

        return $this->response->setJSON(['success' => true]);
    }
}
