"use server";

import prisma from "@/lib/prisma";

export async function getService(id: string) {
    const service = await prisma.service.findUnique({
        where: {
            id
        }
    });

    return service;
}
