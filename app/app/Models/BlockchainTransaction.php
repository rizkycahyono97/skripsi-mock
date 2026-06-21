<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable('document_id',
    'tx_hash',
    'block_number',
    'block_hash',
    'contract_address',
    'document_key',
    'signer_address',
    'gas_used',
    'block_timestamp',
    'status',
    'document_id')]
class BlockchainTransaction extends Model
{
    protected $casts = [
        'block_timestamp' => 'datetime',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }
}
