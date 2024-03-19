/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */

"use client";

import { deleteBreak } from "@/app/admin/breaks/actions";
import { TrashIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export default function BreakDelete({ breakId }) {
    const router = useRouter();

    return (
        <button
            onClick={async () => {
                if (confirm("Do you want to delete it?")) {
                    try {
                        await deleteBreak(breakId);
                        alert("Break has been deleted!");

                        router.refresh();
                    } catch (error) {
                        alert("The Break delete failed!");
                    }
                }
            }}
            aria-label="Save"
        >
            <TrashIcon />
        </button>
    );
}
