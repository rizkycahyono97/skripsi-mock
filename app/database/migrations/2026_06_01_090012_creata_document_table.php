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

            $table->uuid('id')->primary();

            $table->string('document_number')->unique();
            $table->string('document_type');

            $table->string('student_name');
            $table->string('student_nim');

            $table->date('issued_date');

            $table->string('identity_hash', 66);
            $table->string('file_hash', 66);

            $table->uuid('verification_code')->unique();

            $table->foreignId('created_by')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->enum('status', [
                'draft',
                'pending',
                'registered',
                'failed',
            ])->default('draft');

            $table->timestamps();

            $table->index('student_nim');
            $table->index('document_type');
            $table->index('status');
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
