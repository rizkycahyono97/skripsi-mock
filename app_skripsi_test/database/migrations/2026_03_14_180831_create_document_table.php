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
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_surat');
            $table->string('perihal');
            $table->string('tanggal_surat');
            
            // blockchain fields
            $table->string('document_hash', 66)->unique()->nullable();
            $table->string('blockchain_tx_hash', 66)->unique()->nullable();
            $table->string('signer_address', 42)->nullable();
            
            $table->enum('status', ['draft', 'pending', 'signed', 'revoked'])->default('draft');
            $table->timestamp('issued_at')->nullable();
            $table->timestamps();
            
            // FK
            $table->foreignId('student_id')->constrained('students', 'id')->onDelete('cascade');
            $table->foreignId('biro_id')->constrained('biros');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
