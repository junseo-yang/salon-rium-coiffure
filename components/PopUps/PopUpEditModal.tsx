/* eslint-disable no-alert */

"use client";

import Modal from "@/components/Shared/Modal";
import * as Form from "@radix-ui/react-form";
import { useState, Dispatch, SetStateAction, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PopUp } from "@prisma/client"; 
import { putPopUp } from "../../app/admin/popups/actions"; 

const PopUpEditModal = ({
    showDemoModal,
    setShowDemoModal,
    popUp
}: {
    showDemoModal: boolean;
    setShowDemoModal: Dispatch<SetStateAction<boolean>>;
    popUp: PopUp;
}) => {
    const [title, setTitle] = useState(popUp.title);
    const [description, setDescription] = useState(popUp.description);
    const [startDate, setStartDate] = useState(popUp.startDate.toISOString().substring(0, 16));
    const [endDate, setEndDate] = useState(popUp.endDate ? popUp.endDate.toISOString().substring(0, 16) : '');

    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (endDate && new Date(startDate) > new Date(endDate)) {
            alert("Start date cannot be later than the end date.");
            setEndDate("");
            return;
        }

        try {
            await putPopUp(
                popUp.id,
                title,
                description,
                new Date(startDate),
                endDate ? new Date(endDate) : null
            );
            setShowDemoModal(false);
            alert("Pop-up has been updated!");
            router.refresh();
        } catch (error) {
            alert("Failed to update the pop-up!");
        }
    };

    return (
        <Modal showModal={showDemoModal} setShowModal={setShowDemoModal}>
            <div className="w-full overflow-hidden md:max-w-md md:rounded-2xl md:border md:border-gray-100 md:shadow-xl">
                <div className="flex flex-col items-center justify-center space-y-3 bg-white px-4 py-6 pt-8 text-center md:px-16">
                    <Form.Root className="FormRoot" onSubmit={handleSubmit}>

                        {/* Title Field */}
                        <Form.Field className="grid" name="title">
                        <div
                                style={{
                                    display: "flex",
                                    alignItems: "baseline",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Form.Label>Title</Form.Label>
                                <Form.Message
                                    className="FormMessage"
                                    match="valueMissing"
                                >
                                    Please enter a title
                                </Form.Message>
                        </div>
                            <Form.Control asChild>
                                <input
                                    id="title-input"
                                    className="Input"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </Form.Control>
                        </Form.Field>

                        {/* Description Field */}
                        <Form.Field className="grid" name="description">
                        <div
                                style={{
                                    display: "flex",
                                    alignItems: "baseline",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Form.Label className="FormLabel">
                                    Description
                                </Form.Label>
                                <Form.Message
                                    className="FormMessage"
                                    match="valueMissing"
                                >
                                    Please enter a description
                                </Form.Message>
                        </div>
                            <Form.Control asChild>
                                <textarea
                                    id="description-input"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </Form.Control>
                        </Form.Field>


                        {/* Start Date Field */}
                        <Form.Field className="grid" name="startDate">
                        <div
                                style={{
                                    display: "flex",
                                    alignItems: "baseline",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Form.Label className="FormLabel">
                                    Start Date
                                </Form.Label>
                                <Form.Message
                                    className="FormMessage"
                                    match="valueMissing"
                                >
                                    Please enter a start date for pop-up
                                </Form.Message>
                        </div>
                            <Form.Control asChild>
                                <input
                                    id="startDate-input"
                                    type="datetime-local"
                                    className="Input"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                />
                            </Form.Control>
                        </Form.Field>

                        {/* End Date Field */}
                        <Form.Field className="grid" name="endDate">
                        <div
                                style={{
                                    display: "flex",
                                    alignItems: "baseline",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Form.Label className="FormLabel">
                                    End Date (optional)
                                </Form.Label>
                        </div>
                            <Form.Control asChild>
                                <input
                                    id="endDate-input"
                                    type="datetime-local"
                                    className="Input"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </Form.Control>
                        </Form.Field>

                        <Form.Submit asChild>
                            <button 
                                id="update-pop-up-button"
                                type="submit"
                                className="Button"
                                style={{ marginTop: 10 }}
                            >
                                Update Pop-up
                            </button>
                        </Form.Submit>
                    </Form.Root>
                </div>
            </div>
        </Modal>
    );
};

export function usePopUpEditModal(popUp) {
    const [showDemoModal, setShowDemoModal] = useState(false);

    const DemoModalCallback = useCallback(
        () => (
            <PopUpEditModal
                showDemoModal={showDemoModal}
                setShowDemoModal={setShowDemoModal}
                popUp={popUp}
            />
        ),
        [showDemoModal, setShowDemoModal, popUp]
    );

    return useMemo(
        () => ({ setShowDemoModal, DemoModal: DemoModalCallback }),
        [setShowDemoModal, DemoModalCallback]
    );
}
