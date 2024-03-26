import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UpcomingAppointmentsSkeleton } from "@/components/ui//skeletons";
import React, { useEffect, useState } from "react";
import { getUpcomingAppointments } from "./actions";

interface Appointment {
    id: string;
    customer_name: string;
    customer_email: string;
    price: string;
    from_date: Date;
}

export function UpcomingAppointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true); // loading state

    useEffect(() => {
        async function fetchAppointments() {
            setIsLoading(true);
            const upcoming = await getUpcomingAppointments();
            setAppointments(upcoming);
            setIsLoading(false);
        }
        fetchAppointments();
    }, []);

    // Function to extract the initial from the customer name
    const getInitials = (name) => {
        const names = name.split(" ");
        const initials =
            names.length > 1
                ? names[0][0].toUpperCase() +
                  names[names.length - 1][0].toUpperCase()
                : names[0][0].toUpperCase();
        return initials;
    };

    if (isLoading) return <UpcomingAppointmentsSkeleton />;
    if (appointments.length === 0) {
        return (
            <div id="upcomingAppointments" className="py-8 text-center">
                No upcoming appointments found.
            </div>
        );
    }

    return (
        <div id="upcomingAppointments" className="space-y-8">
            {appointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center">
                    <Avatar className="h-9 w-9">
                        <AvatarFallback>
                            {getInitials(appointment.customer_name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="break-all text-sm font-medium leading-none">
                            {appointment.customer_name} -{" "}
                            {appointment.from_date.toLocaleString("en-CA", {
                                timeZone: "America/New_York",
                                year: "numeric",
                                month: "numeric",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false
                            })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {appointment.customer_email}
                        </p>
                    </div>
                    <div className="ml-auto font-medium">
                        ${appointment.price}
                    </div>
                </div>
            ))}
        </div>
    );
}
