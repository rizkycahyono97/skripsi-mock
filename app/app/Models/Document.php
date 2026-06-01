<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['document_number', 'document_type',
    'student_name',
    'student_nim',
    'issued_date',
    'identity_hash',
    'file_hash',
    'verification_code',
    'created_by',
    'status', ])]
class Document extends Model
{
    use HasUuids;

    protected $casts = [
        'issued_date' => 'date',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function file(): HasOne
    {
        return $this->hasOne(DocumentFile::class);
    }

    public function blockchainTransaction(): HasOne
    {
        return $this->hasOne(blockchainTransaction::class);
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class);
    }
}
