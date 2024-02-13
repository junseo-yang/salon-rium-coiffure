'use server';

import { Roles } from "@prisma/client";

export async function createStaff(name: string, description: string, role: Roles) {
    const staff = await prisma?.staff.create({
        data: {
            name,
            description,
            role
        }
    });

    return staff;
}

export async function getStaff(id: string) {
    const staff = await prisma?.staff.findUnique({
        where: {
            id
        }
    });

    return staff;
}

export async function putStaff(staffId: string, name: string, description: string, role: Roles) {
    const result = await prisma?.staff.update({
        where: {
            id: staffId
        },
        data: {
            name,
            description,
            role
        }
    });

    return result;
}

export async function deleteStaff(staffId: string) {
    const result = await prisma?.staff.delete({
        where: {
            id: staffId
        },
    });

    return result;
}
