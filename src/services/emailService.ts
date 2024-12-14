import * as path from 'path';
import { readFileSync } from 'fs';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

export async function sendExamApprovalEmail(
    studentName: string,
    studentEmail: string,
    examSubject: string,
    examDate: any,
    examTime: string,
    examRooms: string[],

): Promise<void> {

    const templatePath = path.join(__dirname, '../templates/exam-approval-email.html');
    let emailTemplate = readFileSync(templatePath, 'utf-8');

    emailTemplate = emailTemplate
        .replace('{{studentName}}', studentName)
        .replace('{{examSubject}}', examSubject)
        .replace('{{examDate}}', examDate)
        .replace('{{examTime}}', examTime)
        .replace('{{examRooms}}', examRooms.join(', '))

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_ADMIN,
        to: studentEmail,
        subject: `Examen Aprobat - ${examSubject}`,
        html: emailTemplate,
    };

    await transporter.sendMail(mailOptions);
}