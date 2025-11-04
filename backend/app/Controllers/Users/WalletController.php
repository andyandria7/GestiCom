<?php
namespace App\Controllers\Users;

use App\Models\WalletModel;
use CodeIgniter\Restful\ResourceController;

class WalletController extends ResourceController{
    public function index(){
        $user_id = $this->request->user_id;

        $wallet = (new WalletModel())->where('user_id', $user_id)->first();

        return $this->respond([
            'status' => true,
            'wallet' => $wallet
        ]);
    }
}