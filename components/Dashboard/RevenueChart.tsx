"use client";

import React, { useState, useEffect } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
    getMonthlyRevenueChartData,
    getYearlyRevenueChartData,
    getWeeklyRevenueChartData,
    getDailyRevenueChartData
} from "./actions";

// Define a type for the revenue data
type RevenueData = { name: string; total: number }[];

export function RevenueChart({
    period
}: {
    period: "Daily" | "Weekly" | "Monthly" | "Yearly";
}) {
    const [data, setData] = useState<RevenueData>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (period === "Monthly") {
                const monthlyRevenue = await getMonthlyRevenueChartData();
                setData(monthlyRevenue);
            } else if (period === "Daily") {
                const DailyRevenue = await getDailyRevenueChartData();
                setData(DailyRevenue);
            } else if (period === "Weekly") {
                const weeklyRevenue = await getWeeklyRevenueChartData();
                setData(weeklyRevenue);
            } else if (period === "Yearly") {
                const yearlyRevenue = await getYearlyRevenueChartData();
                setData(yearlyRevenue);
            }
        };

        fetchData();
    }, [period]); // Rerun when period changes

    return (
        <>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart id="revenueGrowthChart" data={data}>
                    <XAxis
                        dataKey="name"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </>
    );
}
