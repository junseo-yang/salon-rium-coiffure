/* eslint-disable no-console */

"use server";

import { Service, Staff } from "@prisma/client";
import prisma from "@/lib/prisma";
import moment from "moment";
import { sendMail } from "@/lib/mails/mail";
import { compileAppointmentEmailTemplate } from "@/lib/mails/templates/appointmentEmailTemplate";
import { sendTwilio } from "@/lib/twilio/twilio";
import { compileAppointmentTwilioTemplate } from "@/lib/twilio/templates/appointmentTwilioTemplate";
import {
    deleteGoogleCalendar,
    insertGoogleCalendar
} from "@/lib/google-calendar/google-calendar";

export async function getAppointment(id: string) {
    const appointment = await prisma.appointment.findUnique({
        where: {
            id
        }
    });

    return appointment;
}

export async function createAppointment(
    service: Service,
    designer: Staff,

    selectedTime: string,
    selectedDate: string,

    customerName: string,
    customerNumber: string,
    customerEmail: string
) {
    const current = new Date();
    // offset with EDT
    const offset = 4 - current.getTimezoneOffset() / 60;

    // 12 25
    // 10:00 ~ 11:00
    const fromDatetime = new Date();
    const fromTime = selectedTime.split(" ~ ")[0];
    fromDatetime.setMonth(Number(selectedDate.split(" ")[0]) - 1);
    fromDatetime.setDate(Number(selectedDate.split(" ")[1]));
    fromDatetime.setHours(
        // Add Timezone Offset
        Number(fromTime.split(":")[0]) + offset,
        Number(fromTime.split(":")[1]),
        0,
        0
    );

    const toDatetime = new Date(fromDatetime);
    const duration = service.duration.replace("M", "");
    toDatetime.setMinutes(Number(duration));

    const appointment = await prisma.appointment.create({
        data: {
            price: service.price,
            status: "pending",

            from_date: fromDatetime,
            to_date: toDatetime,
            duration: service.duration,

            customer_name: customerName,
            customer_email: customerEmail,
            customer_number: customerNumber,

            service_name: service.name,
            staff_name: designer.name,

            service: {
                connect: {
                    id: service.id
                }
            },

            staff: {
                connect: {
                    id: designer.id
                }
            }
        }
    });

    return appointment;
}

export async function getAvailableTimes(
    service: Service,
    designer: Staff,
    targetDate: Date
) {
    // populate all times divided by duration: (1h)
    const startTime = moment(service.startTime, "HH:mm");
    const endTime = moment(service.endTime, "HH:mm");
    const availableTimes = {};
    const mInterval = service.interval.replace("M", "");
    const mDuration = service.duration.replace("M", "");

    while (startTime.isBefore(endTime)) {
        const endTimeInSlot = moment(startTime).add(Number(mDuration), "m");

        if (endTimeInSlot > endTime) {
            break;
        }

        availableTimes[
            `${startTime.format("HH:mm")} ~ ${endTimeInSlot.format("HH:mm")}`
        ] = true;

        startTime.add(Number(mInterval), "m").format("HH:mm");
    }

    // filter
    // get all designer appointments
    const appointments = await prisma.appointment.findMany({
        where: {
            staffId: designer.id,

            from_date: {
                gte: targetDate,
                lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000)
            }
        }
    });

    // get all breaks
    const breaks = await prisma.break.findMany({
        where: {
            from_datetime: {
                gte: new Date(targetDate.getTime() - 24 * 60 * 60 * 1000)
            },

            to_datetime: {
                lte: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000)
            },

            staffId: designer.id
        }
    });

    Object.keys(availableTimes).forEach((t) => {
        const fromTime = moment(t.split(" ~ ")[0], "HH:mm");
        const toTime = moment(t.split(" ~ ")[1], "HH:mm");
        fromTime.year(targetDate.getFullYear());
        fromTime.month(targetDate.getMonth());
        fromTime.date(targetDate.getDate());
        toTime.year(targetDate.getFullYear());
        toTime.month(targetDate.getMonth());
        toTime.date(targetDate.getDate());

        appointments.forEach((a) => {
            const aStartTime = moment(a.from_date);
            const aEndTime = moment(a.to_date);

            if (aStartTime.isBefore(toTime) && fromTime.isBefore(aEndTime)) {
                availableTimes[t] = false;
            }
        });

        breaks.forEach((b) => {
            const aStartTime = moment(b.from_datetime);
            const aEndTime = moment(b.to_datetime);

            if (aStartTime.isBefore(toTime) && fromTime.isBefore(aEndTime)) {
                availableTimes[t] = false;
            }
        });
    });

    return availableTimes;
}

// Send Appointment Request Email to Admin and Customer
export async function sendEmailAppointmentRequest(
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
    // Send Appointment Request Email to Admin
    await sendMail({
        to: process.env.ADMIN_EMAIL!,
        subject: "[Salon Rium Coiffure] A Customer Appointment is Requested.",
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
            title: "Appointment Request",
            action: "requested"
        })
    });

    // Send Appointment Request Email to Customer
    await sendMail({
        to: customer_email,
        subject: "[Salon Rium Coiffure] Your Appointment is Requested.",
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
            title: "Appointment Request",
            message: "Your appointment will be reviewed by the Admin shortly.",
            action: "requested"
        })
    });
}

// Send Appointment Request Twilio to Customer
export async function sendTwilioAppointmentRequest(
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
            action: "requested"
        })
    });
}

export async function insertGoogleCalendarEvent(
    id: string,
    from_date: Date,
    to_date: Date,
    customer_name: string,
    customer_number: string,
    customer_email: string,
    service_name: string,
    staff_name: string
) {
    const summary = `${staff_name} | ${service_name} | ${customer_name} | ${customer_email} | ${customer_number}`;
    try {
        const googleCalendarEventID = await insertGoogleCalendar({
            summary,
            from_date,
            to_date
        });

        await prisma.appointment.update({
            where: {
                id
            },
            data: {
                google_calendar_event_id: googleCalendarEventID
            }
        });
    } catch (error) {
        console.error(error);
    }
}

export async function deleteGoogleCalendarEvent(
    id: string,
    google_calendar_event_id: string | null
) {
    try {
        await deleteGoogleCalendar(google_calendar_event_id);

        await prisma.appointment.update({
            where: {
                id
            },
            data: {
                google_calendar_event_id: null
            }
        });
    } catch (error) {
        console.error(error);
    }
}
