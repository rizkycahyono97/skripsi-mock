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
        Schema::create('blockchain_transactions', function (Blueprint $table) {

            $table->id();

            $table->uuid('document_id');

            $table->string('tx_hash')->unique();

            $table->unsignedBigInteger('block_number');

            $table->string('contract_address');

            $table->string('signer_address');

            $table->timestamp('confirmed_at')->nullable();

            $table->timestamps();

            $table->foreign('document_id')
                ->references('id')
                ->on('documents')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blockchain_transactions');
    }
};
