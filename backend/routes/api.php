<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
    //     return $request->user();
    // })->middleware('auth:sanctum');
    
use App\Http\Controllers\CustomersController;
Route::post('/c', [CustomersController::class, 'addCnO']);