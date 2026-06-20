<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;

class Student extends Model
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'nim',
        'name',
        'prodi',
        'faculty',
        'email'
    ];

    public function documents(): HasMany {
        return $this->hasMany(Document::class, 'student_id', 'id');
    }
}
