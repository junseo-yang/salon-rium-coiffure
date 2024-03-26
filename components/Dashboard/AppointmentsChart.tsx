"use client";

import React, { useState, useEffect } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { getAppointmentChartData } from "./actions";

type AppointmentData = { name: string; total: number }[];

export function AppointmentsChart({
    period
}: {
    period: "Daily" | "Weekly" | "Monthly" | "Yearly";
}) {
    const [data, setData] = useState<AppointmentData>([]);

    useEffect(() => {
        const fetchData = async () => {
            const appointmentData = await getAppointmentChartData(period);
            setData(appointmentData);
        };

        fetchData();
    }, [period]); // Rerun when period changes

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart id="appointmentsGrowthChart" data={data}>
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
                    tickFormatter={(value) => `${value}`}
                    allowDecimals={false}
                />
                <Bar dataKey="total" fill="#adfa1d" radius={[3, 3, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}
