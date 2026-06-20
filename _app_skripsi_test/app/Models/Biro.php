<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Biro extends Model
{
    protected $fillable = [
        'nama_biro',
        'slug',
        'wallet_address',
        'is_active'
    ];

    public function documents(): HasMany {
        return $this->hasMany(Document::class, 'biro_id', 'id');
    } 
}
