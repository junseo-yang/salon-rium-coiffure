"use server";

import { Duration, Interval, ServiceCategory } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function createService(
    name: string,
    price: string,
    description: string,
    startDate: Date,
    endDate: Date | undefined,
    startTime: string,
    endTime: string,
    staffIds: string[],
    interval: Interval,
    duration: Duration,
    category: ServiceCategory
) {
    const service = await prisma.service.create({
        data: {
            name,
            price,
            startDate,
            endDate,
            startTime,
            endTime,
            description,
            interval,
            duration,
            category,

            staffs: {
                connect: staffIds.map((id) => ({
                    id
                }))
            }
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
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const service = await prisma.service.findMany({
        where: {
            startDate: {
                lte: todayDate
            },
            OR: [
                {
                    endDate: {
                        gte: todayDate
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
    startDate: Date,
    endDate: Date | undefined,
    startTime: string,
    endTime: string,
    staffIds: string[],
    interval: Interval,
    duration: Duration,
    category: ServiceCategory
) {
    const result = await prisma.service.update({
        where: {
            id: serviceId
        },
        data: {
            name,
            price,
            startDate,
            endDate,
            startTime,
            endTime,
            description,
            interval,
            duration,
            category,

            staffs: {
                set: staffIds.map((id) => ({
                    id
                }))
            }
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
