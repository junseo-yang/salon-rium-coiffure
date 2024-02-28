/* eslint-disable no-alert */
import Modal from "@/components/Shared/Modal";
import * as Form from "@radix-ui/react-form";
import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createPopUp } from "../../app/admin/popups/actions";

const PopUpModalComponent = ({
    showDemoModal,
    setShowDemoModal
}: {
    showDemoModal;
    setShowDemoModal;
}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
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

    return (
        <Modal showModal={showDemoModal} setShowModal={setShowDemoModal}>
            <div className="w-full overflow-hidden md:max-w-md md:rounded-2xl md:border md:border-gray-100 md:shadow-xl">
                <div className="flex flex-col items-center justify-center space-y-3 bg-white px-4 py-6 pt-8 text-center md:px-16">
                    <Form.Root
                        className="FormRoot"
                        onSubmit={async (event) => {
                            event.preventDefault();

                            const isStartDateEmpty = checkIsStartDateEmpty();
                            if (!isStartDateEmpty) {
                                return; // Stop form submission if validation fails
                            }

                            if (
                                endDate &&
                                new Date(startDate) > new Date(endDate)
                            ) {
                                alert(
                                    "Start date cannot be later than the end date."
                                );
                                setEndDate("");
                                setEndIsOpen(true);
                                return;
                            }

                            try {
                                await createPopUp(
                                    title,
                                    description,
                                    new Date(startDate),
                                    endDate ? new Date(endDate) : null
                                );
                                setShowDemoModal(false);
                                alert("Pop-up created successfully!");

                                router.refresh();
                            } catch (error) {
                                alert("Failed to create pop-up.");
                            }
                        }}
                    >
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
                                        className="Input cursor-not-allowed"
                                        readOnly
                                    />
                                    <div>
                                        <button
                                            type="button"
                                            onClick={toggleStartDatePicker}
                                            id="start-date-button"
                                        >
                                            Choose Start Date
                                        </button>
                                        <span> / </span>
                                        <button
                                            type="button"
                                            onClick={clearStartDate}
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
                                        className="Input cursor-not-allowed"
                                        readOnly
                                    />
                                    <div>
                                        <button
                                            id="end-date-button"
                                            type="button"
                                            onClick={toggleEndDatePicker}
                                        >
                                            Choose End Date
                                        </button>
                                        <span> / </span>
                                        <button
                                            type="button"
                                            onClick={clearEndDate}
                                        >
                                            Clear End Date
                                        </button>
                                    </div>
                                </div>
                            </Form.Control>
                        </Form.Field>

                        <Form.Submit asChild>
                            <button
                                id="create-pop-up-button"
                                type="submit"
                                className="Button"
                                style={{ marginTop: 10 }}
                            >
                                Create Pop-up
                            </button>
                        </Form.Submit>
                    </Form.Root>
                </div>
            </div>
        </Modal>
    );
};

export function usePopUpModal() {
    const [showDemoModal, setShowDemoModal] = useState(false);

    const DemoModal = useCallback(
        () => (
            <PopUpModalComponent
                showDemoModal={showDemoModal}
                setShowDemoModal={setShowDemoModal}
            />
        ),
        [showDemoModal, setShowDemoModal]
    );

    return useMemo(
        () => ({
            setShowDemoModal,
            DemoModal
        }),
        [DemoModal, setShowDemoModal]
    );
}
