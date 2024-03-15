/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */

"use client";

import { deleteBlocking } from "@/app/admin/blocking/actions";
import { TrashIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export default function BlockingDelete({ blockingId }) {
    const router = useRouter();

    return (
        <button
            onClick={async () => {
                if (confirm("Do you want to delete it?")) {
                    try {
                        await deleteBlocking(blockingId);
                        alert("Blocking has been deleted!");

                        router.refresh();
                    } catch (error) {
                        alert("The Blocking delete failed!");
                    }
                }
            }}
            aria-label="Save"
        >
            <TrashIcon />
        </button>
    );
}
