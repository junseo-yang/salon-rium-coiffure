/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */

"use client";

import { TrashIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { deleteAppointment } from "../../app/admin/appointments/actions";

export default function AppointmentDelete({ appointmentId }) {
    const router = useRouter();

    return (
        <button
            onClick={async () => {
                if (confirm("Do you want to delete it?")) {
                    try {
                        await deleteAppointment(appointmentId);
                        alert("Appointment has been deleted!");

                        router.refresh();
                    } catch (error) {
                        alert("The delete failed!");
                    }
                }
            }}
            aria-label="Save"
        >
            <TrashIcon />
        </button>
    );
}
