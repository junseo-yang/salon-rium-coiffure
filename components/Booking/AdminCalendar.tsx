/* eslint-disable no-alert */

"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Appointment, Blocking } from "@prisma/client";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";

export default function AdminCalendar({ appointments, blockings }) {
    const events: EventInput = [];
    events.push(
        ...appointments.map((a: Appointment) => {
            const r: EventInput = {
                title: `${a.customer_name} ${a.service_name} ${a.staff_name}`,
                start: a.from_date,
                end: a.to_date
            };

            return r;
        })
    );

    events.push(
        ...blockings.map((b: Blocking) => {
            const r: EventInput = {
                title: `${b.name}`,
                start: b.from_datetime,
                end: b.to_datetime,
                backgroundColor: "green"
            };

            return r;
        })
    );

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
