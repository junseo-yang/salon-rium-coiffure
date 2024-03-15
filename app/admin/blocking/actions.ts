"use server";

import prisma from "@/lib/prisma";

async function isAvailableBlocking(b_from_datetime: Date, b_to_datetime: Date) {
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

export async function createBlocking(
    name: string,
    from_datetime: Date,
    to_datetime: Date
) {
    const isTimeAvailable = await isAvailableBlocking(
        from_datetime,
        to_datetime
    );
    if (!isTimeAvailable) {
        return false;
    }

    const newBlocking = await prisma.blocking.create({
        data: {
            name,
            from_datetime,
            to_datetime
        }
    });

    return newBlocking;
}

export async function putBlocking(
    blockingId: string,
    name: string,
    from_datetime: Date,
    to_datetime: Date
) {
    const isTimeAvailable = await isAvailableBlocking(
        from_datetime,
        to_datetime
    );
    if (!isTimeAvailable) {
        return false;
    }

    const result = await prisma.blocking.update({
        where: {
            id: blockingId
        },
        data: {
            name,
            from_datetime,
            to_datetime
        }
    });

    return result;
}

export async function deleteBlocking(blockingId: string) {
    const result = await prisma.blocking.delete({
        where: {
            id: blockingId
        }
    });

    return result;
}
