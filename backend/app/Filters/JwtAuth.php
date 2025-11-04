<?php

namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Config\Services;


class JwtAuth implements FilterInterface{
    public function before(RequestInterface $request, $arguments = null){
        $header = $request->getHeaderLine('Authorization');

        if(!$header || !str_starts_with($header, 'Bearer ')){
            return Services::response()
            ->setStatusCode(401)
            ->setJSON(['status'=>false, 'message'=> 'Token manquant']);
        }

        $token = str_replace('Bearer ', '', $header);

        try{
            $decoded = JWT::decode($token, new Key(getenv('JWT_SECRET'), 'HS256'));
            
            if (isset($decoded->exp) && $decoded->exp < time()) {
                return Services::response()
                ->setStatusCode(401)
                ->setJSON(['status'=> false, 'message'=>'Token expiré']);
            }
            
            $request->user_id = $decoded->user_id ?? null;
            $request->decoded_token = $decoded;
            
        }catch(\Exception $e){
            return Services::response()
            ->setStatusCode(401)
            ->setJSON(['status'=> false, 'message'=>'Token invalide ou expiré']);
        }
    }
    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null){

    }

}