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

            $table->string('tx_hash')->unique();
            $table->unsignedBigInteger('block_number');
            $table->string('block_hash');
            $table->string('contract_address');
            $table->string('document_key');
            $table->string('signer_address');
            $table->integer('gas_used');
            $table->timestamp('block_timestamp')->nullable();
            $table->enum('status', ['SUCCESS', 'FAILED']);

            $table->timestamps();

            $table->foreignId('document_id')
                ->constrained('documents')
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
