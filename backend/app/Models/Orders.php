<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Orders extends Model
{
    protected $table = 'Orders';
    protected $fillable = ['cid', 'details', 'date', 'fee', 'memo'];

    public $timestamps = false;
}
