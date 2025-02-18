<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customers extends Model
{
    // protected $table = 'Customers';
    // protected $primarykey = 'id';
    protected $fillable = ['name', 'tel', 'addr'];

    public $timestamps = false;

    public function orders() {
        return $this->hasMany(Orders::class, 'cid', 'id');
    }
}
