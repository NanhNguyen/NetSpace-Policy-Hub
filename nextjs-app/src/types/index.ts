export type PolicyCategory = string;

export type UserRoleType = 'ADMIN' | 'HR' | 'TICKET_MANAGER' | 'USER';

export interface Role {
    id: number;
    name: string;
    code: UserRoleType;
}

export interface Profile {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    role_id: number; // Foreign key to Role
    role?: Role; // Joined role data
    created_at: string;
}

export type TicketStatus = 'open' | 'answered' | 'closed';

export interface TicketMessage {
    id: string;
    ticket_id: string;
    content: string;
    sender_type: 'employee' | 'hr';
    sender_id?: string | null;
    sender_name?: string | null;
    created_at: string;
}

export interface Policy {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    category: PolicyCategory;
    icon: string;
    published: boolean;
    pdf_url?: string;
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
    user_id?: string | null;
    question: string;
    answer?: string | null;
    status: TicketStatus;
    attachments?: string[];
    answered_by?: string | null;
    created_at: string;
    answered_at?: string | null;
    messages?: TicketMessage[];
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
