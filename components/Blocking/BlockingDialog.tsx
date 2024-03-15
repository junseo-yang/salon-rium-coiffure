"use client";

import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useBlockingModal } from "./BlockingModal";

export default function BlockingDialog() {
    const { DemoModal, setShowDemoModal } = useBlockingModal();
    return (
        <div className="flex h-full items-center">
            <DemoModal />
            <button
                id="btnAddBlocking"
                onClick={() => setShowDemoModal(true)}
                aria-label="Save"
            >
                <PlusCircledIcon />
            </button>
        </div>
    );
}
