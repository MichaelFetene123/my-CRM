<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreNoteRequest extends FormRequest
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
            'entity_type' => ['required', 'in:lead,opportunity,contact'],
            'entity_id' => ['required', 'integer'],
            'body' => ['required', 'string', 'max:5000'],
            'mentioned_user_ids' => ['nullable', 'array'],
            'mentioned_user_ids.*' => ['integer', 'exists:users,id'],
        ];
    }
}
