export interface Lead {
    id: number;
    contact_id: number | null;
    name: string;
    email: string | null;
    source: string | null;
    status: string;
    discard_reason: string | null;
    owner_id: number;
    created_at: string;
    updated_at: string;
}
