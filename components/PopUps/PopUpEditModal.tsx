/* eslint-disable no-alert */

"use client";

import Modal from "@/components/Shared/Modal";
import * as Form from "@radix-ui/react-form";
import {
    useState,
    Dispatch,
    SetStateAction,
    useCallback,
    useMemo
} from "react";
import { useRouter } from "next/navigation";
import { PopUp } from "@prisma/client";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
    const [startDate, setStartDate] = useState(
        popUp.startDate ? new Date(popUp.startDate) : ""
    );
    const [endDate, setEndDate] = useState(
        popUp.endDate ? new Date(popUp.endDate) : ""
    );

    const [startIsOpen, setStartIsOpen] = useState(false);
    const [endIsOpen, setEndIsOpen] = useState(false);
    const [startDateError, setStartDateError] = useState(false);

    const handleStartDateChange = (date) => {
        setStartDate(date);
        setStartDateError(false); // Reset error state upon selection
        setStartIsOpen(false); // Close the start date calendar after selection
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        setEndIsOpen(false); // Close the end date calendar after selection
    };

    const toggleStartDatePicker = () => setStartIsOpen(!startIsOpen);
    const toggleEndDatePicker = () => setEndIsOpen(!endIsOpen);

    const checkIsStartDateEmpty = () => {
        let notEmpty = true;
        if (!startDate) {
            setStartDateError(true);
            notEmpty = false;
        }
        return notEmpty;
    };

    // Function to clear the start date
    const clearStartDate = () => {
        setStartDate("");
        setStartDateError(false);
    };

    // Function to clear the end date
    const clearEndDate = () => {
        setEndDate("");
    };

    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const isStartDateEmpty = checkIsStartDateEmpty();
        if (!isStartDateEmpty) {
            return; // Stop form submission if validation fails
        }

        if (endDate && new Date(startDate) > new Date(endDate)) {
            alert("Start date cannot be later than the end date.");
            setEndDate("");
            setEndIsOpen(true);
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
                <div className="flex flex-col items-center justify-center space-y-3 bg-white px-4 py-6 pt-8 text-center dark:bg-black md:px-16">
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
                                    className="Input dark:bg-black"
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
                                    className="max-h-96 min-h-16 dark:bg-black"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
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
                                {startDateError && (
                                    <span className="FormError">
                                        Please enter a start date
                                    </span> // Display error message
                                )}
                            </div>

                            <Form.Control asChild>
                                <div>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={handleStartDateChange}
                                        onCalendarOpen={() =>
                                            setStartIsOpen(true)
                                        }
                                        onCalendarClose={() =>
                                            setStartIsOpen(false)
                                        }
                                        onClickOutside={() =>
                                            setStartIsOpen(false)
                                        }
                                        open={startIsOpen}
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        timeCaption="Time"
                                        dateFormat="MMMM d, yyyy h:mm aa"
                                        showTimeSelect
                                        className="Input cursor-not-allowed dark:bg-black"
                                        readOnly
                                    />
                                    <div>
                                        <button
                                            id="start-date-button"
                                            type="button"
                                            onClick={toggleStartDatePicker}
                                            className="hover:underline"
                                        >
                                            Choose Start Date
                                        </button>
                                        <span> / </span>
                                        <button
                                            type="button"
                                            onClick={clearStartDate}
                                            className="hover:underline"
                                        >
                                            Clear Start Date
                                        </button>
                                    </div>
                                </div>
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
                                <div>
                                    <DatePicker
                                        selected={endDate}
                                        onChange={handleEndDateChange}
                                        onCalendarOpen={() =>
                                            setEndIsOpen(true)
                                        }
                                        onCalendarClose={() =>
                                            setEndIsOpen(false)
                                        }
                                        onClickOutside={() =>
                                            setEndIsOpen(false)
                                        }
                                        open={endIsOpen}
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        timeCaption="Time"
                                        dateFormat="MMMM d, yyyy h:mm aa"
                                        showTimeSelect
                                        className="Input cursor-not-allowed dark:bg-black"
                                        readOnly
                                    />
                                    <div>
                                        <button
                                            id="end-date-button"
                                            type="button"
                                            onClick={toggleEndDatePicker}
                                            className="hover:underline"
                                        >
                                            Choose End Date
                                        </button>
                                        <span> / </span>
                                        <button
                                            type="button"
                                            onClick={clearEndDate}
                                            className="hover:underline"
                                        >
                                            Clear End Date
                                        </button>
                                    </div>
                                </div>
                            </Form.Control>
                        </Form.Field>

                        <Form.Submit asChild>
                            <button
                                id="update-pop-up-button"
                                type="submit"
                                className="Button hover:underline"
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
