"use server";

import { sendMail } from "@/lib/mails/mail";
import { compileAppointmentConfirmationAdminTemplate } from "@/lib/mails/templates/appointmentConfirmationAdminTemplate";
import { compileAppointmentConfirmationCustomerTemplate } from "@/lib/mails/templates/appointmentConfirmationCustomerTemplate";
import prisma from "@/lib/prisma";

export async function putAppointment(appointMentId: string, status: string) {
    const result = await prisma.appointment.update({
        where: {
            id: appointMentId
        },
        data: {
            status
        }
    });

    return result;
}

export async function deleteAppointment(appointmentId: string) {
    const result = await prisma.appointment.delete({
        where: {
            id: appointmentId
        }
    });

    return result;
}

// Send Appointment Confirmation Email to Admin and Customer
export async function sendEmailAppointmentConfirmation(
    id: string,
    price: string,
    status: string,
    from_date: Date,
    to_date: Date,
    duration: string,
    customer_name: string,
    customer_number: string,
    customer_email: string,
    service_name: string,
    staff_name: string
) {
    const current = new Date();
    // Send Appointment Confirmation Email to Admin
    sendMail({
        to: process.env.ADMIN_EMAIL!,
        subject: "[Salon Rium Coiffure] A Customer Appointment is Confirmed.",
        body: compileAppointmentConfirmationAdminTemplate(
            id,
            price,
            status,
            from_date,
            to_date,
            duration,
            customer_name,
            customer_number,
            customer_email,
            service_name,
            staff_name,
            current
        )
    });

    // Send Appointment Confirmation Email to Customer
    sendMail({
        to: customer_email,
        subject: "[Salon Rium Coiffure] Your Appointment is Confirmed.",
        body: compileAppointmentConfirmationCustomerTemplate(
            id,
            price,
            status,
            from_date,
            to_date,
            duration,
            customer_name,
            customer_number,
            customer_email,
            service_name,
            staff_name,
            current
        )
    });
}

// Send Appointment Cancellation Email to Admin and Customer
export async function sendEmailAppointmentCancellation(
    id: string,
    price: string,
    status: string,
    from_date: Date,
    to_date: Date,
    duration: string,
    customer_name: string,
    customer_number: string,
    customer_email: string,
    service_name: string,
    staff_name: string
) {
    const current = new Date();
    // Send Appointment Cancellation Email to Admin
    sendMail({
        to: process.env.ADMIN_EMAIL!,
        subject: "[Salon Rium Coiffure] A Customer Appointment is Cancelled.",
        body: compileAppointmentConfirmationAdminTemplate(
            id,
            price,
            status,
            from_date,
            to_date,
            duration,
            customer_name,
            customer_number,
            customer_email,
            service_name,
            staff_name,
            current
        )
    });

    // Send Appointment Cancellation Email to Customer
    sendMail({
        to: customer_email,
        subject: "[Salon Rium Coiffure] Your Appointment is Cancelled.",
        body: compileAppointmentConfirmationCustomerTemplate(
            id,
            price,
            status,
            from_date,
            to_date,
            duration,
            customer_name,
            customer_number,
            customer_email,
            service_name,
            staff_name,
            current
        )
    });
}
