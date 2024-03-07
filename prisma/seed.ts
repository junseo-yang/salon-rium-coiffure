/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { PrismaClient, Roles, ServiceCategory } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
    const test_staff_1 = await prisma.staff.upsert({
        where: { name: "Test Staff 1" },
        update: {},
        create: {
            name: "Test Staff 1",
            role: Roles.Designer
        }
    });

    const test_staff_2 = await prisma.staff.upsert({
        where: { name: "Test Staff 2" },
        update: {},
        create: {
            name: "Test Staff 2",
            role: Roles.Designer
        }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const womens_haircut = await prisma.service.upsert({
        where: { name: "Women's Haircut" },
        update: {},
        create: {
            name: "Women's Haircut",
            price: "70",
            category: ServiceCategory.Women,
            startDate: today,
            startTime: "09:00",
            endTime: "19:00",
            staffs: {
                connect: {
                    id: test_staff_1.id
                }
            }
        }
    });

    const womens_bangcut = await prisma.service.upsert({
        where: { name: "Women's Bangcut" },
        update: {},
        create: {
            name: "Women's Bangcut",
            price: "10",
            category: ServiceCategory.Women,
            startDate: today,
            startTime: "09:00",
            endTime: "19:00",
            staffs: {
                connect: {
                    id: test_staff_2.id
                }
            }
        }
    });

    const womens_hairwave_straight = await prisma.service.upsert({
        where: { name: "Women's Hair Wave and Straight Perm" },
        update: {},
        create: {
            name: "Women's Hair Wave and Straight Perm",
            price: "320",
            category: ServiceCategory.Women,
            startDate: today,
            startTime: "09:00",
            endTime: "19:00",
            staffs: {
                connect: {
                    id: test_staff_2.id
                }
            }
        }
    });

    const womens_bang_perm = await prisma.service.upsert({
        where: { name: "Women's Bang Perm" },
        update: {},
        create: {
            name: "Women's Bang Perm",
            price: "95",
            category: ServiceCategory.Women,
            startDate: today,
            startTime: "09:00",
            endTime: "19:00",
            staffs: {
                connect: {
                    id: test_staff_2.id
                }
            }
        }
    });

    const womens_root_volum_perm = await prisma.service.upsert({
        where: { name: "Women's Root Volume Perm" },
        update: {},
        create: {
            name: "Women's Root Volume Perm",
            price: "95",
            category: ServiceCategory.Women,
            startDate: today,
            startTime: "09:00",
            endTime: "19:00",
            staffs: {
                connect: {
                    id: test_staff_2.id
                }
            }
        }
    });

    const womens_regular_colour = await prisma.service.upsert({
        where: { name: "Women's Regular Colour" },
        update: {},
        create: {
            name: "Women's Regular Colour",
            price: "180",
            category: ServiceCategory.Women,
            startDate: today,
            startTime: "09:00",
            endTime: "19:00",
            staffs: {
                connect: {
                    id: test_staff_2.id
                }
            }
        }
    });

    const womens_root_colour = await prisma.service.upsert({
        where: { name: "Women's Root Colour" },
        update: {},
        create: {
            name: "Women's Root Colour",
            price: "80",
            category: ServiceCategory.Women,
            startDate: today,
            startTime: "09:00",
            endTime: "19:00",
            staffs: {
                connect: {
                    id: test_staff_2.id
                }
            }
        }
    });

    const mens_haircut = await prisma.service.upsert({
        where: { name: "Men's Haircut" },
        update: {},
        create: {
            name: "Men's Haircut",
            price: "45",
            category: ServiceCategory.Men,
            startDate: today,
            startTime: "09:00",
            endTime: "19:00",
            staffs: {
                connect: {
                    id: test_staff_1.id
                }
            }
        }
    });

    const mens_side_down_perm = await prisma.service.upsert({
        where: { name: "Men's Side Down Perm" },
        update: {},
        create: {
            name: "Men's Side Down Perm",
            price: "90",
            category: ServiceCategory.Men,
            startDate: today,
            startTime: "09:00",
            endTime: "19:00",
            staffs: {
                connect: {
                    id: test_staff_1.id
                }
            }
        }
    });

    const mens_perm = await prisma.service.upsert({
        where: { name: "Men's Perm" },
        update: {},
        create: {
            name: "Men's Perm",
            price: "190",
            category: ServiceCategory.Men,
            startDate: today,
            startTime: "09:00",
            endTime: "19:00",
            staffs: {
                connect: {
                    id: test_staff_1.id
                }
            }
        }
    });

    const mens_regular_colour = await prisma.service.upsert({
        where: { name: "Men's Regular Colour" },
        update: {},
        create: {
            name: "Men's Regular Colour",
            price: "70",
            category: ServiceCategory.Men,
            startDate: today,
            startTime: "09:00",
            endTime: "19:00",
            staffIds: [test_staff_1.id]
        }
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
