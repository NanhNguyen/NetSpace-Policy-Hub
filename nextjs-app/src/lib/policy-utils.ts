import { Policy } from "@/types";

export const DUMMY_PDF_URL = '1774842051811-form-commitment-social-media.docx';

export const isDummyOrEmpty = (url?: string) => {
    if (!url || url.trim() === '') return true;
    return url.includes(DUMMY_PDF_URL);
};

export const isValidPolicy = (p: Policy) => {
    // A policy is considered "valid" (ready to show) if it has either:
    // 1. Non-empty content (HTML)
    // 2. A real original PDF link (not the dummy commitment form)
    const hasContent = p.content && p.content.trim() !== '' && !p.content.includes('Nội dung đang được cập nhật');
    const hasRealPdf = p.pdf_url && !isDummyOrEmpty(p.pdf_url);
    return hasContent || hasRealPdf;
};
