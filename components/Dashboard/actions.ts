"use server";

import { PrismaClient, ServiceCategory } from "@prisma/client";
import {
    format,
    startOfYear,
    endOfMonth,
    endOfYear,
    addMonths,
    addYears,
    subYears,
    endOfWeek,
    startOfWeek,
    subWeeks,
    endOfDay,
    startOfDay,
    subDays,
    addDays,
    addWeeks,
    startOfMonth,
    subMonths
} from "date-fns";

const prisma = new PrismaClient();

// Total Revenue
export async function getTotalRevenue(): Promise<number> {
    const now = new Date(); // Current date and time
    const appointments = await prisma.appointment.findMany({
        where: {
            status: "confirmed",
            to_date: {
                lte: now
            }
        }
    });

    const totalRevenue = appointments.reduce(
        (acc, curr) => acc + parseFloat(curr.price),
        0
    );

    return totalRevenue;
}

// Revenue Added Last Month
export async function getRevenueLastMonth(): Promise<number> {
    const now = new Date();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const appointments = await prisma.appointment.findMany({
        where: {
            status: "confirmed",
            to_date: {
                gte: startOfLastMonth,
                lte: endOfLastMonth
            }
        }
    });

    const totalRevenue = appointments.reduce(
        (acc, curr) => acc + parseFloat(curr.price),
        0
    );

    return totalRevenue;
}

// Total Users
export async function getTotalUsers(): Promise<number> {
    const totalUsers = await prisma.user.count();
    return totalUsers;
}

// Revenue This Month
export async function getRevenueThisMonth(): Promise<number> {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const appointments = await prisma.appointment.findMany({
        where: {
            status: "confirmed",
            to_date: {
                gte: startOfThisMonth,
                lte: now
            }
        }
    });

    const totalRevenue = appointments.reduce(
        (acc, curr) => acc + parseFloat(curr.price),
        0
    );

    return totalRevenue;
}

// Upcoming Appointments
export async function getUpcomingAppointments(): Promise<any[]> {
    const now = new Date();

    const upcomingAppointments = await prisma.appointment.findMany({
        where: {
            status: "confirmed",
            from_date: {
                gt: now
            }
        },
        orderBy: {
            from_date: "asc"
        },
        take: 5 // Adjust based on how many appointments you want to fetch
    });

    return upcomingAppointments;
}

// Completed Appointments This Month
export async function getCompletedAppointmentsThisMonth(): Promise<number> {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalAppointmentsThisMonth = await prisma.appointment.count({
        where: {
            status: "confirmed",
            from_date: {
                gte: startOfThisMonth,
                lte: now // Ensure the appointment date is not later than today
            }
        }
    });

    return totalAppointmentsThisMonth;
}

// Gets the number of appointments within a specific time range and compares it to the previous period
// and optionally in a specified status
export async function getTotalAppointmentsForPeriod(
    startDate: Date,
    endDate?: Date,
    compare: boolean = false,
    status?: "pending" | "confirmed" | "cancelled"
): Promise<{ total: number; comparison?: string }> {
    const now = new Date();

    const whereClause: any = {
        from_date: {
            gte: startDate,
            lte: endDate
        }
    };

    if (status) {
        whereClause.status = status;
        if (status === "confirmed") {
            // For confirmed appointments, consider only those that are not later than the current time
            whereClause.to_date = { lte: now };
        }
    }

    const total = await prisma.appointment.count({ where: whereClause });

    let comparison = "0.00%";
    if (compare && endDate) {
        const previousPeriodDuration = endDate.getTime() - startDate.getTime();
        const previousPeriodStart = new Date(
            startDate.getTime() - previousPeriodDuration
        );
        const previousPeriodEnd = new Date(startDate.getTime() - 1);

        whereClause.from_date = {
            gte: previousPeriodStart,
            lte: previousPeriodEnd
        };

        const totalPreviousPeriod = await prisma.appointment.count({
            where: whereClause
        });

        const change =
            totalPreviousPeriod === 0
                ? Infinity // Case that no appointments in the previous period
                : ((total - totalPreviousPeriod) / totalPreviousPeriod) * 100;

        // Format comparison as a string with + or - sign
        comparison = Number.isFinite(change)
            ? `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`
            : "No appointments"; // If no appointments in the previous period, return "No appointments"
    }

    return { total, comparison };
}

// Gets the total revenue for all categories of services within a specific time range
export async function getTotalRevenueForPeriod(
    startDate: Date,
    endDate: Date
): Promise<number> {
    const now = new Date(); // Current date and time
    const appointments = await prisma.appointment.findMany({
        where: {
            from_date: { gte: startDate, lte: endDate },
            to_date: { lte: now }, // Ensure the appointment date is not later than today
            status: "confirmed" // Only consider confirmed appointments for revenue calculation
        },
        include: {
            service: true
        }
    });

    const totalRevenue = appointments.reduce(
        (acc, curr) => acc + parseFloat(curr.service.price),
        0
    );

    return totalRevenue;
}

// Gets the revenue for services in a specified category within a specific time range
// and compares it to the previous period, including the percentage of total revenue.
export async function getServiceRevenueForPeriod(
    startDate: Date,
    endDate: Date,
    category: ServiceCategory,
    compare: boolean = false
): Promise<{ revenue: number; comparison: string; percentageOfTotal: string }> {
    const now = new Date(); // Current date and time
    // Helper function to calculate revenue
    const calculateRevenue = (appointments) =>
        appointments.reduce((acc, curr) => {
            // Ensure service is not null before accessing its price
            if (curr.service) {
                return acc + parseFloat(curr.service.price);
            }
            return acc;
        }, 0);

    // First, calculate total revenue for all categories in the current period
    const totalRevenue = await getTotalRevenueForPeriod(startDate, endDate);

    // Then, calculate revenue for the specified category
    // Fetch appointments for the specified category within the period
    const categoryAppointments = await prisma.appointment.findMany({
        where: {
            from_date: { gte: startDate, lte: endDate },
            to_date: { lte: now },
            status: "confirmed",
            service: {
                category
            }
        },
        include: {
            service: true
        }
    });

    const categoryRevenue = calculateRevenue(categoryAppointments);

    let comparison = "0.00%";
    if (compare) {
        // Calculate the time range for the previous period
        const duration = endDate.getTime() - startDate.getTime();
        const previousPeriodStart = new Date(startDate.getTime() - duration);
        const previousPeriodEnd = new Date(startDate.getTime() - 1);

        const previousCategoryAppointments = await prisma.appointment.findMany({
            where: {
                from_date: { gte: previousPeriodStart, lte: previousPeriodEnd },
                status: "confirmed",
                service: {
                    category
                }
            },
            include: {
                service: true
            }
        });

        const previousCategoryRevenue = calculateRevenue(
            previousCategoryAppointments
        );

        const change =
            previousCategoryRevenue === 0
                ? Infinity // Case that no revenue in the previous period
                : ((categoryRevenue - previousCategoryRevenue) /
                      previousCategoryRevenue) *
                  100;

        comparison = Number.isFinite(change)
            ? `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`
            : "No revenue in this category"; // If no revenue in the previous period
    }

    // Calculate percentage of total revenue for the category
    const percentageOfTotal =
        totalRevenue > 0 ? (categoryRevenue / totalRevenue) * 100 : 0;

    return {
        revenue: categoryRevenue,
        comparison,
        percentageOfTotal: `${percentageOfTotal.toFixed(2)}%`
    };
}

// Get data for revenue chart - monthly view
export async function getMonthlyRevenueChartData(): Promise<
    { name: string; total: number }[]
> {
    const now = new Date();
    // Adjust the start point to 11 months back from the current month
    const startMonthDate = subMonths(startOfMonth(now), 11);
    const monthlyRevenuePromises = Array.from({ length: 12 }).map(
        (_, month) => {
            // Calculate the start and end of each month from the startMonthDate
            const monthStartDate = addMonths(startMonthDate, month);
            const monthEndDate = endOfMonth(monthStartDate);

            return getTotalRevenueForPeriod(monthStartDate, monthEndDate).then(
                (revenue) => ({
                    name: format(monthStartDate, "MMM"),
                    total: revenue
                })
            );
        }
    );

    const monthlyRevenueData = await Promise.all(monthlyRevenuePromises);
    return monthlyRevenueData;
}

// Get data for revenue chart - yearly view
export async function getYearlyRevenueChartData(): Promise<
    { name: string; total: number }[]
> {
    const thisYear = new Date();
    const startYear = subYears(thisYear, 9); // Go back 10 years at most

    const yearlyRevenuePromises: Promise<{ name: string; total: number }>[] =
        [];

    for (let year = startYear; year <= thisYear; year = addYears(year, 1)) {
        const yearStartDate = startOfYear(year);
        const yearEndDate = endOfYear(yearStartDate);

        yearlyRevenuePromises.push(
            getTotalRevenueForPeriod(yearStartDate, yearEndDate).then(
                (revenue) => ({
                    name: format(yearStartDate, "yyyy"),
                    total: revenue
                })
            )
        );
    }

    const yearlyRevenueData = await Promise.all(yearlyRevenuePromises);
    return yearlyRevenueData;
}

// Get data for revenue chart - weekly view
export async function getWeeklyRevenueChartData(): Promise<
    { name: string; total: number }[]
> {
    const now = new Date();
    const weeklyRevenuePromises: Promise<{ name: string; total: number }>[] =
        [];

    for (let week = 3; week >= 0; week -= 1) {
        // Recent 4 weeks
        const weekStartDate = startOfWeek(subWeeks(now, week));
        const weekEndDate = endOfWeek(weekStartDate);

        // Break the loop if the start of the week is in the future
        if (weekStartDate > now) break;

        weeklyRevenuePromises.push(
            getTotalRevenueForPeriod(weekStartDate, weekEndDate).then(
                (revenue) => ({
                    // Use the week start date as the name
                    name: `${format(weekStartDate, "M/d")}`,
                    total: revenue
                })
            )
        );
    }

    const weeklyRevenueData = await Promise.all(weeklyRevenuePromises);
    return weeklyRevenueData;
}

// Get data for revenue chart - daily view
export async function getDailyRevenueChartData(): Promise<
    { name: string; total: number }[]
> {
    const now = new Date();
    const dailyRevenuePromises: Promise<{ name: string; total: number }>[] = [];

    for (let day = 6; day >= 0; day -= 1) {
        // Recent 7 days
        const dayStartDate = startOfDay(subDays(now, day));
        const dayEndDate = endOfDay(dayStartDate);

        // Break the loop if the start of the day is in the future
        if (dayStartDate > now) break;

        dailyRevenuePromises.push(
            getTotalRevenueForPeriod(dayStartDate, dayEndDate).then(
                (revenue) => ({
                    // Use the day start date or any other identifier as the name
                    name: `${format(dayStartDate, "M/d")}`,
                    total: revenue
                })
            )
        );
    }

    const dailyRevenueData = await Promise.all(dailyRevenuePromises);
    return dailyRevenueData;
}

// Appointments Chart Data Function
// Gets the total number of appointments for each period (Daily, Weekly, Monthly, Yearly)
export async function getAppointmentChartData(
    period: "Daily" | "Weekly" | "Monthly" | "Yearly"
): Promise<{ name: string; total: number }[]> {
    let startPeriodFunc;
    let addPeriodFunc;
    let formatStr;
    let periodLength;

    switch (period) {
        case "Daily":
            startPeriodFunc = startOfDay;
            addPeriodFunc = addDays;
            formatStr = "M/d";
            periodLength = 7; // Recent 7 days
            break;
        case "Weekly":
            startPeriodFunc = startOfWeek;
            addPeriodFunc = addWeeks;
            formatStr = "M/d";
            periodLength = 4; // Recent 4 weeks
            break;
        case "Monthly":
            startPeriodFunc = startOfMonth;
            addPeriodFunc = addMonths;
            formatStr = "MMM";
            periodLength = 12; // Recent 12 months
            break;
        case "Yearly":
            startPeriodFunc = startOfYear;
            addPeriodFunc = addYears;
            formatStr = "yyyy";
            periodLength = 10; // Recent 10 years
            break;
        default:
            throw new Error("Invalid period specified");
    }

    const now = new Date();
    let chartDataPromises;

    if (period === "Yearly") {
        // For Yearly, we go from oldest to newest
        const startYear = addYears(startOfYear(now), -(periodLength - 1));
        chartDataPromises = Array.from({ length: periodLength }).map(
            (_, index) => {
                const periodStart = addPeriodFunc(startYear, index);
                const periodEnd = addPeriodFunc(periodStart, 1);

                return prisma.appointment
                    .count({
                        where: {
                            // status: "confirmed",
                            // no need to specify a status since it's a total appointment number
                            from_date: {
                                gte: periodStart,
                                lt: periodEnd
                            }
                        }
                    })
                    .then((total) => ({
                        name: format(periodStart, formatStr),
                        total
                    }));
            }
        );
    } else {
        // For all other periods, logic remains the same
        chartDataPromises = Array.from({ length: periodLength }).map(
            (_, index) => {
                const periodStart = startPeriodFunc(
                    addPeriodFunc(now, index - (periodLength - 1))
                );
                const periodEnd = addPeriodFunc(periodStart, 1);

                return prisma.appointment
                    .count({
                        where: {
                            // status: "confirmed",
                            // no need to specify a status since it's a total appointment number
                            from_date: {
                                gte: periodStart,
                                lt: periodEnd
                            }
                        }
                    })
                    .then((total) => ({
                        name: format(periodStart, formatStr),
                        total
                    }));
            }
        );
    }

    return Promise.all(chartDataPromises);
}
