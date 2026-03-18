import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;

    constructor() {
        // Simulated SMTP - for development it just logs to console
        // In production, configure with real SMTP credentials
        this.transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: 'fakeuser@ethereal.email',
                pass: 'fakepass'
            }
        });
    }

    async sendTicketAnswer(to: string, name: string, question: string, answer: string) {
        console.log(`[MAIL] Sending notification to ${to}...`);

        const mailOptions = {
            from: '"NetSpace Policy Hub" <no-reply@netspace.com.vn>',
            to,
            subject: 'HR đã phản hồi thắc mắc của bạn',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #10b981;">Chào ${name},</h2>
                    <p>Đội ngũ HR vừa phản hồi thắc mắc của bạn trên hệ thống Policy Hub.</p>
                    
                    <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; font-size: 12px; color: #6b7280; font-weight: bold; text-transform: uppercase;">Câu hỏi của bạn:</p>
                        <p style="margin: 5px 0 0 0; font-style: italic;">"${question}"</p>
                    </div>
                    
                    <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
                        <p style="margin: 0; font-size: 12px; color: #065f46; font-weight: bold; text-transform: uppercase;">Phản hồi từ HR:</p>
                        <p style="margin: 5px 0 0 0; font-weight: 500;">${answer}</p>
                    </div>
                    
                    <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
                        Bạn có thể xem lại thắc mắc này tại trang FAQ của hệ thống.
                        <br>Trân trọng,<br><strong>Đội ngũ NetSpace HR</strong>
                    </p>
                </div>
            `,
        };

        try {
            // For now we just log it because we don't have real credentials
            // In a real scenario, this would be: await this.transporter.sendMail(mailOptions);
            console.log("-----------------------------------------");
            console.log(`Gửi Email đến: ${to}`);
            console.log(`Tiêu đề: ${mailOptions.subject}`);
            console.log(`Nội dung: ${answer}`);
            console.log("-----------------------------------------");
            return { sent: true };
        } catch (error) {
            console.error('Error sending email:', error);
            return { sent: false };
        }
    }
}
