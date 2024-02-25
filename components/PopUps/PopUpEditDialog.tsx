"use client";

import { Pencil1Icon } from "@radix-ui/react-icons";
import { usePopUpEditModal } from "./PopUpEditModal"; 

export default function PopUpEditDialog({ popUp }) {
    const { DemoModal, setShowDemoModal } = usePopUpEditModal(popUp);

    return (
        <>
            <DemoModal />
            <button onClick={() => setShowDemoModal(true)} aria-label="Edit Pop-Up">
                <Pencil1Icon />
            </button>
        </>
    );
}
