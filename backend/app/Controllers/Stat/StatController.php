<?php

namespace App\Controllers\Stat;

use CodeIgniter\RESTful\ResourceController;

class StatController extends ResourceController
{
    public function index()
    {
        $db = \Config\Database::connect();
        $currentYear = date('Y');

        // 💰 1️⃣ Montant investi et retiré par mois
        $investments = $db->query("
            SELECT 
                MONTH(created_at) AS month,
                SUM(amount) AS total_invested
            FROM transactions
            WHERE type IN ('deposit_request', 'payment_request')
            AND status = 'validé'
            AND YEAR(created_at) = '$currentYear'
            GROUP BY MONTH(created_at)
        ")->getResult();

        $withdrawals = $db->query("
            SELECT 
                MONTH(created_at) AS month,
                SUM(amount) AS total_withdrawn
            FROM transactions
            WHERE type IN ('withdrawal_request')
            AND status = 'validé'
            AND YEAR(created_at) = '$currentYear'
            GROUP BY MONTH(created_at)
        ")->getResult();

        // 👥 2️⃣ Répartition des utilisateurs
        $users = $db->query("
            SELECT role, CAST(COUNT(*) AS UNSIGNED) AS count
FROM users
GROUP BY role
        ")->getResult();

        // 📦 3️⃣ Packs créés par mois
        $packs = $db->query("
            SELECT MONTH(created_at) AS month, COUNT(*) AS count
            FROM packs
            WHERE YEAR(created_at) = '$currentYear'
            GROUP BY MONTH(created_at)
        ")->getResult();

        // Client créés
        $totalClients = $db->query("SELECT COUNT(*) AS totalClients FROM clients")->getRow();

        // Livraison
       $deliveriesPerMonth = $db->query("
    SELECT MONTH(delivery_date) AS month, COUNT(*) AS count
    FROM deliveries
    WHERE status = 'validated'
    AND YEAR(delivery_date) = '$currentYear'
    GROUP BY MONTH(delivery_date)
")->getResult();

        // 🛍️ 4️⃣ Produits créés par mois
        $products = $db->query("
            SELECT MONTH(created_at) AS month, COUNT(*) AS count
            FROM products
            WHERE YEAR(created_at) = '$currentYear'
            GROUP BY MONTH(created_at)
        ")->getResult();

        // 💸 5️⃣ Transactions récentes
        $recentTransactions = $db->table('transactions')
            ->select('transactions.*, users.first_name, users.last_name')
            ->join('users', 'users.user_id = transactions.user_id', 'left')
            ->orderBy('transactions.created_at', 'DESC')
            ->limit(10)
            ->get()
            ->getResult();

        return $this->response->setJSON([
            'investments' => $investments,
            'withdrawals' => $withdrawals,
            'userDistribution' => $users,
            'packsPerMonth' => $packs,
            'productsPerMonth' => $products,
            'recentTransactions' => $recentTransactions,
            'deliveriesPerMonth' => $deliveriesPerMonth,
            'totalClients' => $totalClients->totalClients,
        ]);
    }
}
