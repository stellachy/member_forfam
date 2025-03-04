<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Orders;

class OrdersController extends Controller
{
    // 存粹新增訂單
    public function addOrder(Request $request)
    {
        try {
            $validated = $request->validate([
                'cid' => 'required|integer|min:1',
                'details' => 'required|array',
                'details.*.var' => 'required|string|max:50',
                'details.*.num' => 'required|integer|min:1',
                'details.*.price' => 'required|integer|min:1',
                'date' => 'required|date',
                'fee' => 'nullable|integer|min:0', 
                'memo' => 'nullable|string'
            ]);

            $order = Orders::create([
                'cid' => $validated['cid'],
                'details' => json_encode($validated['details']),
                'date' => $validated['date'],
                'fee' => $validated['fee'] ?? 0,
                'memo' => $validated['memo'] ?? null
            ]);

            $order->details = json_decode($order->details);

            return response()->json(['Success' => $order]);
        } catch (\Exception $e) {
            return response()->json(['Error' => $e->getMessage()], 500);
        }
    }
}
