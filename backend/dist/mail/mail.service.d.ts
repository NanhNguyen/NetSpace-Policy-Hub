export declare class MailService {
    private transporter;
    constructor();
    sendTicketAnswer(to: string, name: string, question: string, answer: string): Promise<{
        sent: boolean;
    }>;
}
