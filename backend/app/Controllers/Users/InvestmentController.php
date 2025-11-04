<?php
namespace App\Controllers\Users;

use App\Models\PackModel;
use App\Models\ProductModel;
use App\Models\InvestmentModel;
use App\Models\NotificationModel;
use CodeIgniter\RESTful\ResourceController;

class InvestmentController extends ResourceController
{
    public function listInvestments()
    {
        $userId = $this->request->user_id;
        $notificationModel = new NotificationModel();

        $db = \Config\Database::connect();
        $builder = $db->table('investments i');

        $builder->select('
            i.investment_id,
            i.quantity,
            i.total_amount,
            i.created_at,
            i.reference,
            p.pack_id,
            p.pack_name,
            p.return_on_investment,
            p.objective_quantity,
            pr.product_id,
            pr.name as product_name,
            pr.image_url,
            COALESCE(SUM(i2.quantity),0) as total_invested,
            (p.objective_quantity - COALESCE(SUM(i2.quantity),0)) as remaining_quantity,
            (COALESCE(SUM(i2.quantity),0)/p.objective_quantity)*100 as progress_percentage
        ');

        $builder->join('packs p', 'p.pack_id = i.pack_id');
        $builder->join('products pr', 'pr.product_id = i.product_id');
        $builder->join('investments i2', 'i2.pack_id = i.pack_id', 'left'); // total investi pour le pack
        $builder->where('i.user_id', $userId);
        $builder->groupBy('i.investment_id, p.pack_id, pr.product_id');

        $packs = $builder->get()->getResult();

        foreach ($packs as $pack) {
            if ($pack->progress_percentage >= 100) {
                $existing = $notificationModel
                    ->where('user_id', $userId) 
                    ->where('type', 'success')  
                    ->where('message', 'Félicitations ! L\'objectif pour le pack "' . $pack->pack_name . '" a été atteint.')
                    ->first();

                if (!$existing) {
                    $notificationModel->insert([
                        'user_id' => $userId,
                        'title' => 'Objectif atteint',
                        'message' => 'Félicitations ! L\'objectif pour le pack "' . $pack->pack_name . '" a été atteint.',
                        'type' => 'success',
                        'icon' => 'trophy',
                        'status_icon' => 'check-square-o',
                        'status_color' => '#4ade80',
                        'read' => 0,
                    ]);
                }
            }
        }

        return $this->response->setJSON($packs);
    }
}

