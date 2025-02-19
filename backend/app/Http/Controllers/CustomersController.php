<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customers;
use App\Models\Orders;
use Illuminate\Auth\Events\Validated;
use Illuminate\Support\Facades\DB;

class CustomersController extends Controller
{
    // 新增會員及訂單
    public function addCnO(Request $request)
    {
        try {
            // 資料驗證
            $validated = $request->validate([
                'name' => 'required|string|max:50',
                'tel' => 'required|string|max:19',
                'addr' => 'required|string|max:99',
                'details' => 'required|array',  // 因為 JSON 進來時 Laravel 會自動轉成 array
                'details.*.var' => 'required|string|max:50',
                'details.*.num' => 'required|integer|min:1',
                'details.*.price' => 'required|integer|min:1',
                'date' => 'required|date',
            ]);

            // transaction確保兩筆資料都要成功
            DB::beginTransaction();

            $customer = Customers::create([
                'name' => $validated['name'],
                'tel' => $validated['tel'],
                'addr' => $validated['addr']
            ]);

            Orders::create([
                'cid' => $customer->id,
                'details' => json_encode($validated['details']),
                'date' => $validated['date']
            ]);

            DB::commit();

            $customer->orders->each(function ($order) {
                $order->details = json_decode($order->details, true);
            });

            return response()->json(['Success' => $customer]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // 取得客戶訂單
    public function searchC(Request $request)
    {
        $customer = Customers::where('tel', $request->tel)
            ->with('orders')->first();

        if ($customer) {
            $customer->orders->each(function ($order) {
                $order->details = json_decode($order->details);
            });
        }

        return response()->json(['exists' => $customer ? true : false, 'customer' => $customer]);
    }
}
