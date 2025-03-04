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
        // Orders表中 新增「備註」欄位
        Schema::table('Orders', function(Blueprint $table) {
            $table->text('memo')->nullable();
        });

        // Customers表中 修改「tel」欄位為default('')
        Schema::table('Customers', function(Blueprint $table) {
            $table->string('tel')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 取消新增
        Schema::table('Orders', function(Blueprint $table) {
            $table->dropColumn('memo');
        });

        // 取消修改（改回not nullable）
        Schema::table('Customers', function(Blueprint $table) {
            $table->string('tel')->nullable(false)->change();
        });
    }
};
