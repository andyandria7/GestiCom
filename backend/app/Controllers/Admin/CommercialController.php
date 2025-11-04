<?php
namespace App\Controllers\Admin;
use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;

class CommercialController extends ResourceController
{
    protected $modelName = 'App\Models\UserModel';
    protected $format    = 'json';

    public function index()
    {
        $data = $this->model->where('role', 'commercial')->findAll();
        return $this->respond($data);
    }

    public function update($id = null)
    {
        $json = $this->request->getJSON();

        $commercial = $this->model->find($id);
        if (!$commercial) {
            return $this->failNotFound("Commercial non trouvé.");
        }

        $commercial['actif'] = $json->actif;
        if ($this->model->update($id, $commercial)) {
            return $this->respondUpdated(['message' => 'Statut mis à jour']);
        }
        return $this->failServerError('Impossible de mettre à jour le statut');
    }

    public function delete($id = null)
    {
        $commercial = $this->model->find($id);
        if (!$commercial) {
            return $this->failNotFound("Commercial non trouvé.");
        }

        if ($this->model->delete($id)) {
            return $this->respondDeleted(['message' => 'Commercial supprimé']);
        }
        return $this->failServerError('Impossible de supprimer le commercial');
    }
}
