"use server";

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
