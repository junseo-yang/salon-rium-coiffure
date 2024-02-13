/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */

"use client";

import { TrashIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { deleteService } from "../../app/admin/services/actions";

export default function ServiceDelete({ serviceId }) {
    const router = useRouter();

    return (
        <button
            onClick={async () => {
                if (confirm("Do you want to delete it?")) {
                    try {
                        await deleteService(serviceId);
                        alert("Service has been deleted!");

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
