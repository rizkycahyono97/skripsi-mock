<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable('document_id',
    'tx_hash',
    'block_number',
    'contract_address',
    'signer_address',
    'confirmed_at',
    'document_id')]
class BlockchainTransaction extends Model
{
    protected $casts = [
        'confirmed_at' => 'datetime',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }
}
