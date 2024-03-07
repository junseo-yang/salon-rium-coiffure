/* eslint-disable no-alert */

"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Appointment } from "@prisma/client";
import interactionPlugin from "@fullcalendar/interaction";

export default function AdminCalendar({ appointments }) {
    const events = appointments.map((a: Appointment) => ({
        title: `${a.customer_name} ${a.service_name} ${a.staff_name}`,
        start: a.from_date,
        end: a.to_date
    }));

    return (
        <>
            <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin]}
                events={events}
                allDaySlot={false}
                eventMinHeight={15}
                eventShortHeight={40}
                nowIndicator
                slotDuration="00:15"
                slotLabelInterval="01:00"
                slotMinTime="09:00"
                slotMaxTime="24:00"
                editable
                headerToolbar={{
                    left: "title",
                    right: "addBlock timeGridWeek,timeGridDay today prev,next"
                }}
                customButtons={{
                    addBlock: {
                        text: "Add off block",
                        click: () => {
                            alert("Try to add it");
                        }
                    }
                }}
            />
        </>
    );
}
