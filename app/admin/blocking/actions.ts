"use server";

import prisma from "@/lib/prisma";

export async function createBlocking(
    name: string,
    from_datetime: Date,
    to_datetime: Date
) {
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
