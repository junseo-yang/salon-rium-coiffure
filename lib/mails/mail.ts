/* eslint-disable no-console */
import nodemailer from "nodemailer";

export async function sendMail({
    to,
    subject,
    body
}: {
    to: string;
    subject: string;
    body: string;
}) {
    const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

    const transport = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        secure: false, // true for 465, false for other ports
        auth: {
            user: SMTP_EMAIL,
            pass: SMTP_PASSWORD
        }
    });

    try {
        await transport.verify();
    } catch (e) {
        console.error(e);
        return;
    }

    try {
        const response = await transport.sendMail({
            from: SMTP_EMAIL,
            to,
            subject,
            html: body
        });

        console.log(`Mail sent successfully! - to: ${to}`);

        return response;
    } catch (e) {
        console.error(e);
    }
}
