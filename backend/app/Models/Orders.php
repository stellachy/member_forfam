<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Orders extends Model
{
    protected $fillable = ['cid', 'details', 'date'];

    public $timestamps = false;
}
