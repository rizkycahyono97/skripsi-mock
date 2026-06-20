<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Document extends Model
{
    protected $fillable = [
        'nomor_surat',
        'perihal',
        'tanggal_surat',
        'document_hash',
        'blockchain_tx_hash',
        'signer_address',
        'status',
        'issued_at',
        'student_id',
        'biro_id',
    ];

    protected $casts = [
        'tanggal_surat' => 'date',
        'issued_at' => 'datetime'
    ];

    public function student(): BelongsTo {
        return $this->belongsTo(Student::class, 'student_id', 'id');
    }

    public function biro(): BelongsTo {
        return $this->belongsTo(Biro::class, 'biro_id', 'id');
    }
}
