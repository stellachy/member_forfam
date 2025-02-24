<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('Orders', function (Blueprint $table) {
            // 新增欄位 'fee'
            $table->unsignedInteger('fee')->default(0); // 大於等於零的正整數 設定預設值0
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('Orders', function (Blueprint $table) {
            // 刪除欄位
            $table->dropColumn('fee');
        });
    }
};
