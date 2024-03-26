"use client";

import React, { useEffect, useState } from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { AdminNav } from "@/components/Shared/AdminNav";
import { RevenueChart } from "@/components/Dashboard/RevenueChart";
import { AppointmentsChart } from "@/components/Dashboard/AppointmentsChart";
import { UpcomingAppointments } from "@/components/Dashboard/UpcomingAppointments";

import {
    getTotalRevenue,
    getRevenueLastMonth,
    getRevenueThisMonth,
    getTotalUsers,
    getTotalAppointmentsForPeriod,
    getServiceRevenueForPeriod
} from "./actions";

export default function Dashboard() {
    const [isLoading, setIsLoading] = useState(true); // loading state
    const [pendingAppointments, setPendingAppointments] = useState(0);
    const [showMessage, setShowMessage] = useState(false);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [revenueAddedLastMonth, setRevenueAddedLastMonth] = useState(0);
    const [revenueAddedThisMonth, setRevenueAddedThisMonth] = useState(0);
    const [completedAppointmentsThisMonth, setCompletedAppointmentsThisMonth] =
        useState(0);

    const [revenueChartSelectedPeriod, setRevenueChartSelectedPeriod] =
        useState<"Daily" | "Weekly" | "Monthly" | "Yearly">("Monthly");

    const [
        appointmentsChartSelectedPeriod,
        setAppointmentsChartSelectedPeriod
    ] = useState<"Daily" | "Weekly" | "Monthly" | "Yearly">("Monthly");

    const [analyticsSelectedPeriod, setAnalyticsSelectedPeriod] =
        useState("Monthly");

    const Period =
        analyticsSelectedPeriod.charAt(0).toLowerCase() +
        analyticsSelectedPeriod.slice(1, -2);
    const [totalAppointmentsByPeriod, setTotalAppointmentsByPeriod] =
        useState(0);

    const [
        totalAppointmentsComparisonByPeriod,
        setTotalAppointmentsComparisonByPeriod
    ] = useState<string | undefined>("");

    const [completedAppointmentsByPeriod, setCompletedAppointmentsByPeriod] =
        useState(0);

    const [
        completedAppointmentsComparisonByPeriod,
        setCompletedAppointmentsComparisonByPeriod
    ] = useState<string | undefined>("");

    const [cancelledAppointmentsByPeriod, setCancelledAppointmentsByPeriod] =
        useState(0);

    const [
        cancelledAppointmentsComparisonByPeriod,
        setCancelledAppointmentsComparisonByPeriod
    ] = useState<string | undefined>("");

    const [menRevenueForPeriod, setMenRevenueForPeriod] = useState(0);
    const [menRevenueComparisonByPeriod, setMenRevenueComparisonByPeriod] =
        useState("");
    const [menRevenuePercentageByPeriod, setMenRevenuePercentageByPeriod] =
        useState("");
    const [womenRevenueForPeriod, setWomenRevenueForPeriod] = useState(0);
    const [womenRevenueComparisonByPeriod, setWomenRevenueComparisonByPeriod] =
        useState("");
    const [womenRevenuePercentageByPeriod, setWomenRevenuePercentageByPeriod] =
        useState("");
    const [kidRevenueForPeriod, setKidRevenueForPeriod] = useState(0);
    const [kidRevenueComparisonByPeriod, setKidRevenueComparisonByPeriod] =
        useState("");
    const [kidRevenuePercentageByPeriod, setKidRevenuePercentageByPeriod] =
        useState("");

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);

            const now = new Date();

            const startOfThisMonth = new Date(
                now.getFullYear(),
                now.getMonth(),
                1
            );

            const endOfThisMonth = new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                0
            );

            const startOfWeek = new Date(
                now.setDate(now.getDate() - now.getDay())
            );
            startOfWeek.setHours(0, 0, 0, 0);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);

            const startOfYear = new Date(now.getFullYear(), 0, 1);
            const endOfYear = new Date(
                now.getFullYear(),
                11,
                31,
                23,
                59,
                59,
                999
            );

            let StartDate;
            let EndDate;

            // Period selection for analytics tab
            switch (analyticsSelectedPeriod) {
                case "Weekly":
                    StartDate = startOfWeek;
                    EndDate = endOfWeek;
                    break;
                case "Monthly":
                    StartDate = startOfThisMonth;
                    EndDate = endOfThisMonth;
                    break;
                case "Yearly":
                    StartDate = startOfYear;
                    EndDate = endOfYear;
                    break;
                default:
                    throw new Error("Invalid period specified");
            }

            // Set state with the fetched data
            const { total: pendingAppointmentsCount } =
                await getTotalAppointmentsForPeriod(
                    new Date(0),
                    undefined,
                    false,
                    "pending"
                );
            setPendingAppointments(pendingAppointmentsCount);
            setShowMessage(pendingAppointmentsCount > 0);

            const revenue = await getTotalRevenue();
            setTotalRevenue(revenue);

            const revenueLastMonth = await getRevenueLastMonth();
            setRevenueAddedLastMonth(revenueLastMonth);

            const users = await getTotalUsers();
            setTotalUsers(users);

            const revenueThisMonth = await getRevenueThisMonth();
            setRevenueAddedThisMonth(revenueThisMonth);

            const appointmentsThisMonth = await getTotalAppointmentsForPeriod(
                startOfThisMonth,
                endOfThisMonth,
                true,
                "confirmed"
            );
            setCompletedAppointmentsThisMonth(appointmentsThisMonth.total);

            const {
                total: totalAppointments,
                comparison: totalAppointmentsComparison
            } = await getTotalAppointmentsForPeriod(StartDate, EndDate, true);
            setTotalAppointmentsByPeriod(totalAppointments);
            setTotalAppointmentsComparisonByPeriod(totalAppointmentsComparison);

            const {
                total: completedAppointments,
                comparison: completedAppointmentsComparison
            } = await getTotalAppointmentsForPeriod(
                StartDate,
                EndDate,
                true,
                "confirmed"
            );
            setCompletedAppointmentsByPeriod(completedAppointments);
            setCompletedAppointmentsComparisonByPeriod(
                completedAppointmentsComparison
            );

            const {
                total: cancelledAppointments,
                comparison: cancelledAppointmentsComparison
            } = await getTotalAppointmentsForPeriod(
                StartDate,
                EndDate,
                true,
                "cancelled"
            );
            setCancelledAppointmentsByPeriod(cancelledAppointments);
            setCancelledAppointmentsComparisonByPeriod(
                cancelledAppointmentsComparison
            );

            const {
                revenue: menRevenue,
                comparison: menRevenueComparison,
                percentageOfTotal: menRevenuePercentage
            } = await getServiceRevenueForPeriod(
                StartDate,
                EndDate,
                "Men",
                true
            );
            setMenRevenueForPeriod(menRevenue);
            setMenRevenueComparisonByPeriod(menRevenueComparison);
            setMenRevenuePercentageByPeriod(menRevenuePercentage);

            const {
                revenue: womenRevenue,
                comparison: womenRevenueComparison,
                percentageOfTotal: womenRevenuePercentage
            } = await getServiceRevenueForPeriod(
                StartDate,
                EndDate,
                "Women",
                true
            );
            setWomenRevenueForPeriod(womenRevenue);
            setWomenRevenueComparisonByPeriod(womenRevenueComparison);
            setWomenRevenuePercentageByPeriod(womenRevenuePercentage);

            const {
                revenue: kidRevenue,
                comparison: kidRevenueComparison,
                percentageOfTotal: kidRevenuePercentage
            } = await getServiceRevenueForPeriod(
                StartDate,
                EndDate,
                "Kid",
                true
            );
            setKidRevenueForPeriod(kidRevenue);
            setKidRevenueComparisonByPeriod(kidRevenueComparison);
            setKidRevenuePercentageByPeriod(kidRevenuePercentage);

            setIsLoading(false); // load complete
        }

        fetchData();
    }, [analyticsSelectedPeriod]);

    return (
        <ScrollArea className="h-full">
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                {showMessage && (
                    <div className="relative mb-4 rounded border border-gray-200 px-4 py-2">
                        <p>
                            You have <strong>{pendingAppointments}</strong>{" "}
                            pending appointments, click{" "}
                            <a
                                href="/admin/appointments"
                                className="text-blue-500 hover:underline"
                            >
                                here
                            </a>{" "}
                            to see them.
                        </p>
                    </div>
                )}
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">
                        Hi, Welcome back 👋
                    </h2>
                </div>
                <AdminNav />
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total Revenue
                                    </CardTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-muted-foreground"
                                    >
                                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                    </svg>
                                </CardHeader>

                                <CardContent>
                                    {isLoading ? (
                                        <>
                                            <Skeleton className="mb-1 h-6 w-48" />
                                            <Skeleton className="h-4 w-32" />
                                        </>
                                    ) : (
                                        <>
                                            <div
                                                id="totalRevenue"
                                                className="text-2xl font-bold"
                                            >
                                                ${totalRevenue.toFixed(2)}
                                            </div>
                                            <Separator className="my-1" />
                                            <p className="text-xs text-muted-foreground">
                                                + $
                                                {revenueAddedLastMonth.toFixed(
                                                    2
                                                )}{" "}
                                                from last month
                                            </p>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Users
                                    </CardTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-muted-foreground"
                                    >
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <Skeleton className="h-6 w-48" />
                                    ) : (
                                        <div
                                            id="totalUsers"
                                            className="text-2xl font-bold"
                                        >
                                            {totalUsers}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Sales
                                    </CardTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-muted-foreground"
                                    >
                                        <rect
                                            width="20"
                                            height="14"
                                            x="2"
                                            y="5"
                                            rx="2"
                                        />
                                        <path d="M2 10h20" />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <Skeleton className="h-6 w-48" />
                                    ) : (
                                        <div
                                            id="monthlyRevenue"
                                            className="text-2xl font-bold"
                                        >
                                            +{revenueAddedThisMonth}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Revenue</CardTitle>
                                    <Select
                                        value={revenueChartSelectedPeriod}
                                        onValueChange={(newValue) =>
                                            setRevenueChartSelectedPeriod(
                                                newValue as
                                                    | "Daily"
                                                    | "Weekly"
                                                    | "Monthly"
                                                    | "Yearly"
                                            )
                                        }
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue
                                                placeholder={
                                                    revenueChartSelectedPeriod
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Daily">
                                                Daily
                                            </SelectItem>
                                            <SelectItem value="Weekly">
                                                Weekly
                                            </SelectItem>
                                            <SelectItem value="Monthly">
                                                Monthly
                                            </SelectItem>
                                            <SelectItem value="Yearly">
                                                Yearly
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <RevenueChart
                                        period={revenueChartSelectedPeriod}
                                    />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Appointments</CardTitle>
                                    <Select
                                        value={appointmentsChartSelectedPeriod}
                                        onValueChange={(newValue) =>
                                            setAppointmentsChartSelectedPeriod(
                                                newValue as
                                                    | "Daily"
                                                    | "Weekly"
                                                    | "Monthly"
                                                    | "Yearly"
                                            )
                                        }
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue
                                                placeholder={
                                                    appointmentsChartSelectedPeriod
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Daily">
                                                Daily
                                            </SelectItem>
                                            <SelectItem value="Weekly">
                                                Weekly
                                            </SelectItem>
                                            <SelectItem value="Monthly">
                                                Monthly
                                            </SelectItem>
                                            <SelectItem value="Yearly">
                                                Yearly
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <AppointmentsChart
                                        period={appointmentsChartSelectedPeriod}
                                    />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Upcoming Appointments</CardTitle>
                                    {isLoading ? (
                                        <Skeleton className="mb-2 h-4 w-48" />
                                    ) : (
                                        <CardDescription>
                                            You made{" "}
                                            {completedAppointmentsThisMonth}{" "}
                                            appointments this month.
                                        </CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <UpcomingAppointments />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-4">
                        <Select
                            value={analyticsSelectedPeriod}
                            onValueChange={setAnalyticsSelectedPeriod}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue
                                    placeholder={analyticsSelectedPeriod}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Weekly">
                                    This Week
                                </SelectItem>
                                <SelectItem value="Monthly">
                                    This Month
                                </SelectItem>
                                <SelectItem value="Yearly">
                                    This Year
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <Card className="col-span-3">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total Appointments
                                    </CardTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4"
                                    >
                                        <rect
                                            x="3"
                                            y="4"
                                            width="18"
                                            height="18"
                                            rx="2"
                                            ry="2"
                                        />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <>
                                            <Skeleton className="mb-1 h-6 w-48" />
                                            <Skeleton className="h-4 w-32" />
                                        </>
                                    ) : (
                                        <>
                                            <div
                                                id="totalAppointments"
                                                className="text-2xl font-bold"
                                            >
                                                {totalAppointmentsByPeriod}
                                            </div>
                                            <Separator className="my-1" />
                                            <p className="text-xs text-muted-foreground">
                                                {
                                                    totalAppointmentsComparisonByPeriod
                                                }{" "}
                                                from last {Period}
                                            </p>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                            <Card className="col-span-1">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Completed
                                    </CardTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4"
                                    >
                                        <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <>
                                            <Skeleton className="mb-1 h-6 w-24" />
                                            <Skeleton className="h-4 w-12" />
                                        </>
                                    ) : (
                                        <>
                                            <div
                                                id="completedAppointments"
                                                className="text-2xl font-bold"
                                            >
                                                {completedAppointmentsByPeriod}
                                            </div>
                                            <Separator className="my-1" />
                                            <p className="text-xs text-muted-foreground">
                                                {completedAppointmentsComparisonByPeriod ===
                                                "No appointments"
                                                    ? "No completed appointments"
                                                    : completedAppointmentsComparisonByPeriod}{" "}
                                                from last {Period}
                                            </p>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                            <Card className="col-span-2">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Cancelled
                                    </CardTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4"
                                    >
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <>
                                            <Skeleton className="mb-1 h-6 w-32" />
                                            <Skeleton className="h-4 w-24" />
                                        </>
                                    ) : (
                                        <>
                                            <div
                                                id="cancelledAppointments"
                                                className="text-2xl font-bold"
                                            >
                                                {cancelledAppointmentsByPeriod}{" "}
                                                (
                                                {totalAppointmentsByPeriod > 0
                                                    ? (
                                                          (cancelledAppointmentsByPeriod /
                                                              totalAppointmentsByPeriod) *
                                                          100
                                                      ).toFixed(2)
                                                    : "0.00"}
                                                %)
                                            </div>
                                            <Separator className="my-1" />
                                            <p className="text-xs text-muted-foreground">
                                                {cancelledAppointmentsComparisonByPeriod ===
                                                "No appointments"
                                                    ? "No cancelled appointments"
                                                    : cancelledAppointmentsComparisonByPeriod}{" "}
                                                from last {Period}
                                            </p>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Men
                                    </CardTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-muted-foreground"
                                    >
                                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <>
                                            <Skeleton className="mb-1 h-6 w-48" />
                                            <Skeleton className="mb-1 h-4 w-32" />
                                            <Skeleton className="h-4 w-32" />
                                        </>
                                    ) : (
                                        <>
                                            <div
                                                id="menRevenue"
                                                className="text-2xl font-bold"
                                            >
                                                ${menRevenueForPeriod}
                                            </div>
                                            <div className="text-xl font-bold">
                                                {menRevenuePercentageByPeriod}
                                            </div>
                                            <Separator className="my-1" />
                                            <p className="text-xs text-muted-foreground">
                                                {menRevenueComparisonByPeriod}{" "}
                                                from last {Period}
                                            </p>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Women
                                    </CardTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-muted-foreground"
                                    >
                                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <>
                                            <Skeleton className="mb-1 h-6 w-48" />
                                            <Skeleton className="mb-1 h-4 w-32" />
                                            <Skeleton className="h-4 w-32" />
                                        </>
                                    ) : (
                                        <>
                                            <div
                                                id="womenRevenue"
                                                className="text-2xl font-bold"
                                            >
                                                ${womenRevenueForPeriod}
                                            </div>
                                            <div className="text-xl font-bold">
                                                {womenRevenuePercentageByPeriod}
                                            </div>
                                            <Separator className="my-1" />
                                            <p className="text-xs text-muted-foreground">
                                                {womenRevenueComparisonByPeriod}{" "}
                                                from last {Period}{" "}
                                            </p>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Kid
                                    </CardTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-muted-foreground"
                                    >
                                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <>
                                            <Skeleton className="mb-1 h-6 w-48" />
                                            <Skeleton className="mb-1 h-4 w-32" />
                                            <Skeleton className="h-4 w-32" />
                                        </>
                                    ) : (
                                        <>
                                            <div
                                                id="kidRevenue"
                                                className="text-2xl font-bold"
                                            >
                                                ${kidRevenueForPeriod}
                                            </div>
                                            <div className="text-xl font-bold">
                                                {kidRevenuePercentageByPeriod}
                                            </div>
                                            <Separator className="my-1" />
                                            <p className="text-xs text-muted-foreground">
                                                {kidRevenueComparisonByPeriod}{" "}
                                                from last {Period}{" "}
                                            </p>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </ScrollArea>
    );
}
