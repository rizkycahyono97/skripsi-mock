<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable('document_id',
    'original_file',
    'verified_file',
    'file_size', )]
class DocumentFile extends Model
{
    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }
}
