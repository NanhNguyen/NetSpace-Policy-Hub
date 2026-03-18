export type PolicyCategory =
    | 'leave' | 'it' | 'finance' | 'conduct' | 'hr' | 'benefits';

export type TicketStatus = 'open' | 'answered' | 'closed';

export interface Policy {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    category: PolicyCategory;
    icon: string;
    published: boolean;
    attachments?: string[];
    created_by?: string;
    created_at: string;
    updated_at: string;
}

export interface Ticket {
    id: string;
    employee_name: string;
    employee_email: string;
    topic?: string;
    question: string;
    answer?: string | null;
    status: TicketStatus;
    attachments?: string[];
    answered_by?: string | null;
    created_at: string;
    answered_at?: string | null;
}

export interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
    order_index: number;
    published: boolean;
}

export interface SearchLog {
    id: string;
    query: string;
    result_count: number;
    user_id?: string | null;
    created_at: string;
}
