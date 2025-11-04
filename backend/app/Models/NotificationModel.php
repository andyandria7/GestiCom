<?php

namespace App\Models;
use CodeIgniter\Model;

class NotificationModel extends Model
{
    protected $table = 'notifications';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'user_id', 'title', 'message', 'type',
        'icon', 'status_icon', 'status_color',
        'read', 'created_at'
    ];
    protected $useTimestamps = false;
}
