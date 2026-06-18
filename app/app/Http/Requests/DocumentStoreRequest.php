<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class DocumentStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'document_number' => ['required', 'string', 'max:256', 'unique:documents,document_number'],
            'document_type' => ['required', 'string', 'max:256'],
            'title' => ['required', 'string', 'max:256'],
            'issued_date' => ['required', 'date'],
            'metadata' => ['required', 'array'],
            'file' => ['required', 'file', 'mimes:pdf', 'max:10240'],
        ];
    }
}
