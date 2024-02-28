"use client";

import { PlusCircledIcon } from "@radix-ui/react-icons";
import { usePopUpModal } from "./PopUpModal";

export default function PopUpDialog() {
    const { DemoModal, setShowDemoModal } = usePopUpModal();
    return (
        <div className="flex h-full items-center">
            <DemoModal />
            <button 
                id="btnAddPopUp"
                onClick={() => setShowDemoModal(true)} 
                aria-label="Add Pop-Up">
                <PlusCircledIcon />
            </button>
        </div>
    );
}
