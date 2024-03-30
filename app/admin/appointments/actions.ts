/* eslint-disable no-console */

"use server";

import { deleteGoogleCalendar } from "@/lib/google-calendar/google-calendar";
import { sendMail } from "@/lib/mails/mail";
import { compileAppointmentEmailTemplate } from "@/lib/mails/templates/appointmentEmailTemplate";
import prisma from "@/lib/prisma";
import { compileAppointmentTwilioTemplate } from "@/lib/twilio/templates/appointmentTwilioTemplate";
import { sendTwilio } from "@/lib/twilio/twilio";

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
    // Delete Google Calendar Event if it exists
    const appointment = await prisma.appointment.findUnique({
        where: {
            id: appointmentId
        }
    });

    if (appointment?.google_calendar_event_id) {
        try {
            await deleteGoogleCalendar(appointment.google_calendar_event_id);
        } catch (error) {
            console.error(error);
        }
    }

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

    // Replacing char M in duration
    duration = duration.replace("M", "");

    // Send Appointment Confirmation Email to Admin
    await sendMail({
        to: process.env.ADMIN_EMAIL!,
        subject: "[Salon Rium Coiffure] A Customer Appointment is Confirmed.",
        body: compileAppointmentEmailTemplate({
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
            // additional params
            current,
            isAdmin: true,
            title: "Appointment Confirmation",
            action: "confirmed"
        })
    });

    // Send Appointment Confirmation Email to Customer
    await sendMail({
        to: customer_email,
        subject: "[Salon Rium Coiffure] Your Appointment is Confirmed.",
        body: compileAppointmentEmailTemplate({
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
            // additional params
            current,
            isAdmin: false,
            title: "Appointment Confirmation",
            action: "confirmed"
        })
    });
}

// Send Appointment Confirmation Twilio to Customer
export async function sendTwilioAppointmentConfirmation(
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
    await sendTwilio({
        to: customer_number,
        body: compileAppointmentTwilioTemplate({
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
            // additional params
            current,
            action: "confirmed"
        })
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

    // Replacing char M in duration
    duration = duration.replace("M", "");

    // Send Appointment Cancellation Email to Admin
    await sendMail({
        to: process.env.ADMIN_EMAIL!,
        subject: "[Salon Rium Coiffure] A Customer Appointment is Cancelled.",
        body: compileAppointmentEmailTemplate({
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
            // additional params
            current,
            isAdmin: true,
            title: "Appointment Cancellation",
            action: "cancelled"
        })
    });

    // Send Appointment Cancellation Email to Customer
    await sendMail({
        to: customer_email,
        subject: "[Salon Rium Coiffure] Your Appointment is Cancelled.",
        body: compileAppointmentEmailTemplate({
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
            // additional params
            current,
            isAdmin: false,
            title: "Appointment Cancellation",
            action: "cancelled"
        })
    });
}

// Send Appointment Cancellation Twilio to Customer
export async function sendTwilioAppointmentCancellation(
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
    await sendTwilio({
        to: customer_number,
        body: compileAppointmentTwilioTemplate({
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
            // additional params
            current,
            action: "cancelled"
        })
    });
}
