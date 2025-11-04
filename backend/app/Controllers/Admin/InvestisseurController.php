<?php
namespace App\Controllers\Admin;
use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;

class InvestisseurController extends ResourceController
{
    protected $modelName = 'App\Models\UserModel';
    protected $format    = 'json';

    public function index()
    {
        $data = $this->model->where('role', 'investor')->findAll();
        return $this->respond($data);
    }

    public function update($id = null)
    {
        $json = $this->request->getJSON();
        if (!$json || !isset($json->actif)) {
            return $this->failValidationError("Champ 'actif' manquant.");
        }

        $investisseur = $this->model->find($id);
        if (!$investisseur) {
            return $this->failNotFound("Investisseur non trouvé.");
        }

        $investisseur['actif'] = $json->actif;
        if ($this->model->update($id, $investisseur)) {
            return $this->respondUpdated(['message' => 'Statut mis à jour']);
        }
        return $this->failServerError('Impossible de mettre à jour le statut');
    }

    public function delete($id = null)
    {
        $investisseur = $this->model->find($id);
        if (!$investisseur) {
            return $this->failNotFound("Investisseur non trouvé.");
        }

        if ($this->model->delete($id)) {
            return $this->respondDeleted(['message' => 'Investisseur supprimé']);
        }
        return $this->failServerError('Impossible de supprimer l\'investisseur');
    }
}
