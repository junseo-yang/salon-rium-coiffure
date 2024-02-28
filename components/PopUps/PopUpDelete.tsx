/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */

"use client";

import { TrashIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { deletePopUp } from "../../app/admin/popups/actions";

export default function PopUpDelete({ popUpId }) {
    const router = useRouter();

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this pop-up?")) {
            try {
                await deletePopUp(popUpId);
                alert("Pop-up has been deleted!");
                router.refresh(); 
            } catch (error) {
                alert("Failed to delete the pop-up.");
            }
        }
    };

    return (
        <button onClick={handleDelete} aria-label="Delete Pop-Up">
            <TrashIcon />
        </button>
    );
}
