<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreDocumentReqeust extends FormRequest
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
            'document_number' => ['required', 'string', 'unique:documents'],
            'document_type' => ['required', 'string'],
            'title' => ['required', 'string'],
            'issued_date' => ['required', 'date'],
            'metadata' => ['required', 'array'],
            'file' => ['required', 'file', 'mimes:pdf', 'max:10240'],
        ];
    }
}
