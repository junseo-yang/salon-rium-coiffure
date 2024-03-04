"use server";

import { ServiceCategory } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function createService(
    name: string,
    price: string,
    description: string,
    category: ServiceCategory
) {
    const today = new Date();
    const aYearFromNow = new Date();
    aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);

    const service = await prisma.service.create({
        data: {
            name,
            price,
            startDate: today,
            endDate: aYearFromNow,
            description,
            category,
            startTime: "09:00",
            endTime: "19:00"
        }
    });

    return service;
}

export async function getService(id: string) {
    const service = await prisma.service.findUnique({
        where: {
            id
        }
    });

    return service;
}

export async function getAvailableService(queryOptions?) {
    const service = await prisma.service.findMany({
        where: {
            startDate: {
                lte: new Date().toISOString()
            },
            OR: [
                {
                    endDate: {
                        gte: new Date().toISOString()
                    }
                },
                {
                    endDate: {
                        isSet: false
                    }
                }
            ]
        },

        ...queryOptions
    });

    return service;
}

export async function putService(
    serviceId: string,
    name: string,
    price: string,
    description: string,
    category: ServiceCategory
) {
    const result = await prisma.service.update({
        where: {
            id: serviceId
        },
        data: {
            name,
            price,
            description,
            category
        }
    });

    return result;
}

export async function deleteService(serviceId: string) {
    const result = await prisma.service.delete({
        where: {
            id: serviceId
        }
    });

    return result;
}
