"use server";

import prisma from "@/lib/prisma";
import { Staff } from "@prisma/client";

async function isAvailableBreak(b_from_datetime: Date, b_to_datetime: Date) {
    const appointments = await prisma.appointment.findMany({
        where: {
            from_date: {
                gte: b_from_datetime
            },

            to_date: {
                lte: b_to_datetime
            }
        }
    });

    if (appointments.length > 0) {
        return false;
    }

    return true;
}

export async function createBreak(
    name: string,
    staff: Staff,
    from_datetime: Date,
    to_datetime: Date
) {
    const isTimeAvailable = await isAvailableBreak(from_datetime, to_datetime);
    if (!isTimeAvailable) {
        return false;
    }

    const newBreak = await prisma.break.create({
        data: {
            name,
            from_datetime,
            to_datetime,

            staffId: staff.id
        }
    });

    return newBreak;
}

export async function putBreak(
    breakId: string,
    staff: Staff,
    name: string,
    from_datetime: Date,
    to_datetime: Date
) {
    const isTimeAvailable = await isAvailableBreak(from_datetime, to_datetime);
    if (!isTimeAvailable) {
        return false;
    }

    const result = await prisma.break.update({
        where: {
            id: breakId
        },
        data: {
            name,
            staffId: staff.id,
            from_datetime,
            to_datetime
        }
    });

    return result;
}

export async function deleteBreak(breakId: string) {
    const result = await prisma.break.delete({
        where: {
            id: breakId
        }
    });

    return result;
}
