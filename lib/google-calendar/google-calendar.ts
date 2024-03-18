/* eslint-disable no-console */
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import AuthOptions from "@/app/api/auth/[...nextauth]/options";

const GOOGLE_CALENDAR_URL =
    "https://www.googleapis.com/calendar/v3/calendars/primary/events";

export async function getCalendarEvent() {
    const session = await getServerSession(AuthOptions);

    // Admin Auth
    if (session?.user.role !== "admin") {
        console.log("Not Authorized");
        return;
    }

    const account = await prisma.account.findFirst({
        where: {
            userId: session?.user.id
        }
    });

    const resp = await fetch(GOOGLE_CALENDAR_URL, {
        headers: {
            Authorization: `Bearer ${account?.access_token}`
        }
    });

    const data = await resp.json();
    console.log(data);
}

// Insert Google Calendar Event and return inserted event id or raise exception
export async function insertGoogleCalendar({
    summary,
    description,
    from_date,
    to_date
}: {
    summary: string;
    description: string;
    from_date: Date;
    to_date: Date;
}) {
    const session = await getServerSession(AuthOptions);

    // Admin Auth
    if (session?.user.role !== "admin") {
        console.log("Not Authorized");
        return;
    }

    const account = await prisma.account.findFirst({
        where: {
            userId: session?.user.id
        }
    });

    // Send API Request
    const resp = await fetch(GOOGLE_CALENDAR_URL, {
        headers: {
            Authorization: `Bearer ${account?.access_token}`
        },
        method: "POST",
        body: JSON.stringify({
            summary,
            description,
            start: {
                dateTime: from_date,
                timeZone: "America/New_York"
            },
            end: {
                dateTime: to_date,
                timeZone: "America/New_York"
            }
        })
    });

    const data = await resp.json();

    if (!resp.ok) {
        throw new Error(data.error.message);
    }

    console.log(`Google Calendar Event Created: ${summary}`);

    return data.id;
}

// Delete Google Calendar Event or raise exception
export async function deleteGoogleCalendar(eventId) {
    const session = await getServerSession(AuthOptions);

    // Admin Auth
    if (session?.user.role !== "admin") {
        console.log("Not Authorized");
        return;
    }

    const account = await prisma.account.findFirst({
        where: {
            userId: session?.user.id
        }
    });

    // Send API Request
    const resp = await fetch(`${GOOGLE_CALENDAR_URL}/${eventId}`, {
        headers: {
            Authorization: `Bearer ${account?.access_token}`
        },
        method: "DELETE"
    });

    if (!resp.ok) {
        const data = await resp.json();
        throw new Error(data.error.message);
    }

    console.log("Google Calendar Event Deleted");
}
