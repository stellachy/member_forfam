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
        Schema::table('Customers', function (Blueprint $table) {
            // 修改欄位限制字數
            $table->string('name', 51)->change();
            $table->string('tel', 20)->change();
            $table->string('addr', 100)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 改回欄位原本的設定  // 注意不是使用Schema::create，而是用table之後再使用->change
        Schema::table('Customers', function (Blueprint $table) {
            $table->string('name', 255)->change();
            $table->string('tel', 255)->change();
            $table->string('addr', 255)->change();
        });
    }
};
