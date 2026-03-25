<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Document extends Model
{


    protected $fillable = [
        'student_id',
        'nomor_surat',
        'perihal',
        'tanggal_surat',
        'document_hash',
        'blockchain_tx_hash',
        'signer_address',
        'status',
        'issued_at'
    ];

    protected $casts = [
        'tanggal_surat' => 'date',
        'issued_at' => 'datetime'
    ];

    public function student(): BelongsTo {
        return $this->belongsTo(Student::class, 'student_id', 'id');
    }
}
