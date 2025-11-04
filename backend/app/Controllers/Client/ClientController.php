<?php

namespace App\Controllers\Client;

use App\Models\ClientModel;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class ClientController extends ResourceController
{
    protected $model;
    protected $format = 'json';

    public function __construct()
    {
        $this->model = new ClientModel();
    }

    public function create()
    {
        $input = $this->request->getJSON(true);

       

        if (!$this->model->validate($input)) {
            return $this->failValidationErrors($this->model->errors());
        }

        $clientData = [
            'first_name' => $input['first_name'],
            'last_name' => $input['last_name'],
            'contact' => $input['contact'],
            'adresse' => $input['adresse'],
        ];

        $id = $this->model->insert($clientData);
        if ($id) {
            return $this->respondCreated(['status' => 'Client created', 'id' => $id]);
        }

        return $this->failServerError('Erreur du server pour la creation du formulaire du client.');
    }

    public function list()
    {
        $clients = $this->model->findAll(); 
        
        return $this->respond([
            'status' => true,
            'clients' => $clients
        ]);
    }

    public function delete($id = null)
    {
        $client = $this->model->find($id);
        if ($client) {
            $this->model->delete($id);
            return $this->respondDeleted(['status' => 'Client deleted']);
        }
        return $this->failNotFound('Client introuvable.');
    }
}
