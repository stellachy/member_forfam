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
        Schema::create('Orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('cid');  // 對應Customers中id的資料型態
            // 設立外鍵並設定當customers中id被刪除時，自動刪除此表中的有參照其id的資料
            $table->foreign('cid')->references('id')->on('Customers')->onDelete('cascade');
            $table->json('details');
            $table->date('date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Orders');
    }
};
