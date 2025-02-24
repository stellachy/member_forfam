<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
    //     return $request->user();
    // })->middleware('auth:sanctum');
    
use App\Http\Controllers\CustomersController;
use App\Http\Controllers\OrdersController;
use App\Models\Customers;

Route::post('/c', [CustomersController::class, 'addCnO']);
Route::post('/o', [OrdersController::class, 'addOrder']);
Route::get('/c/check', [CustomersController::class, 'searchC']);
Route::get('/c/{id}', [CustomersController::class, 'searchCinfo']);
Route::get('/c', function () {
    return Customers::all();
});