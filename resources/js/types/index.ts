import { type LucideIcon } from 'lucide-react';

export interface Role {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    permissions?: Permission[];
}

export interface Permission {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}
export interface Contact {
    id: number;
    name: string;
    company: string | null;
    email: string | null;
    phone: string | null;
    status: 'prospect' | 'customer' | 'inactive';
    created_at: string;
    updated_at: string;
}

export interface Lead {
    id: number;
    contact_id: number | null;
    name: string;
    email: string | null;
    source: string | null;
    status: 'new' | 'qualified' | 'converted' | 'discarded';
    discard_reason: string | null;
    owner_id: number;
    created_at: string;
    updated_at: string;
}

export interface PipelineStage {
    id: number;
    name: string;
    order: number;
    is_won: boolean;
    is_lost: boolean;
}

export interface Opportunity {
    id: number;
    contact_id: number;
    lead_id: number | null;
    title: string;
    stage_id: number;
    status: 'open' | 'won' | 'lost';
    lost_reason: string | null;
    stage_entered_at: string | null;
    owner_id: number;
    created_at: string;
    updated_at: string;
    contact?: Contact;
    stage?: PipelineStage;
    notes?: Note[];
    activities?: Activity[];
}

export interface Activity {
    id: number;
    entity_type: 'lead' | 'opportunity' | 'contact';
    entity_id: number;
    type: 'call' | 'meeting' | 'task' | 'email';
    due_at: string;
    completed_at: string | null;
    owner_id: number;
    created_at: string;
}

export interface Note {
    id: number;
    entity_type: 'lead' | 'opportunity' | 'contact';
    entity_id: number;
    body: string;
    is_system_generated: boolean;
    created_by: number | null;
    created_at: string;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
}

export interface NavItem {
    title: string;
    href: any;
    icon?: LucideIcon;
    isActive?: boolean;
    badge?: number;
}

export * from './ui';
export * from './auth';
export * from './navigation';

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: import('./auth').Auth;
};
