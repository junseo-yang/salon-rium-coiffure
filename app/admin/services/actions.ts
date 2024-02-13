'use server'

import { ServiceCategory } from "@prisma/client"
import prisma from "@/lib/prisma";
 
export async function createService(name: string, price: string, description: string, category: ServiceCategory) {
    const service = await prisma.service.create({
        data: {
            name,
            price,
            startDate: new Date(),
            description,
            category
        }
    })
    
    return service
}

export async function getService(id: string) {
    const service = await prisma.service.findUnique({
        where: {
            id
        }
    })
    
    return service
}

export async function putService(serviceId: string, name:string , price: string, description: string, category: ServiceCategory) {
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
    })
    
    return result
}

export async function deleteService(serviceId: string) {
    const result = await prisma.service.delete({
        where: {
            id: serviceId
        },
    })
    
    return result
}