"use server";

import { Service, Staff } from "@prisma/client";
import prisma from "@/lib/prisma";
import moment from "moment";
import { sendMail } from "@/lib/mails/mail";
import { compileAppointmentRequestAdminTemplate } from "@/lib/mails/templates/appointmentRequestAdminTemplate";
import { compileAppointmentRequestCustomerTemplate } from "@/lib/mails/templates/appointmentRequestCustomerTemplate";

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
    // 12 25
    // 10:00 ~ 11:00
    const fromDatetime = new Date();
    fromDatetime.setMonth(Number(selectedDate.split(" ")[0]) - 1);
    fromDatetime.setDate(Number(selectedDate.split(" ")[1]));
    fromDatetime.setHours(
        Number(selectedTime.split(" ~ ")[0].replace(":00", "")),
        0,
        0,
        0
    );

    const toDatetime = new Date();
    toDatetime.setMonth(Number(selectedDate.split(" ")[0]) - 1);
    toDatetime.setDate(Number(selectedDate.split(" ")[1]));
    toDatetime.setHours(
        Number(selectedTime.split(" ~ ")[1].replace(":00", "")),
        0,
        0,
        0
    );

    const appointment = await prisma.appointment.create({
        data: {
            price: service.price,
            status: "pending",

            from_date: fromDatetime,
            to_date: toDatetime,
            duration: "1hour",

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
    const times: string[] = [];
    while (startTime.isBefore(endTime)) {
        const a = startTime.format("HH:mm");
        const b = startTime.add(1, "h").format("HH:mm");
        times.push(`${a} ~ ${b}`);
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

    const availableTimes = times.filter((t) => {
        let isAvailable = true;
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
                isAvailable = false;
            }
        });

        return isAvailable;
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
    sendMail({
        to: process.env.ADMIN_EMAIL!,
        subject: "[Salon Rium Coiffure] A Customer Appointment is Requested.",
        body: compileAppointmentRequestAdminTemplate(
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

    // Send Appointment Request Email to Customer
    sendMail({
        to: customer_email,
        subject: "[Salon Rium Coiffure] Your Appointment is Requested.",
        body: compileAppointmentRequestCustomerTemplate(
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
