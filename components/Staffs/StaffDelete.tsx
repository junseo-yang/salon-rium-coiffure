/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */

"use client";

import { TrashIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { deleteStaff } from "../../app/admin/staffs/actions";

export default function StaffDelete({ staffId }) {
    const router = useRouter();

    return (
        <button
            onClick={async () => {
                if (confirm("Are you sure you want to delete this staff member?")) {
                    try {
                        await deleteStaff(staffId);
                        alert("Staff member has been deleted!");
                        router.refresh();
                    } catch (error) {
                        alert("Failed to delete the staff member.");
                    }
                }
            }}
            aria-label="Delete Staff"
        >
            <TrashIcon />
        </button>
    );
}
