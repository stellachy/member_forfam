<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customers extends Model
{
    protected $table = 'Customers';  // 放到雲端上會需要明確指定表，不然會因為大小寫或是預設的關係而找不到！！
    // protected $primarykey = 'id';
    protected $fillable = ['name', 'tel', 'addr'];

    public $timestamps = false;

    public function orders() {
        return $this->hasMany(Orders::class, 'cid', 'id');
    }
}
