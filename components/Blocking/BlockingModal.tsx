/* eslint-disable no-alert */
import Modal from "@/components/Shared/Modal";
import * as Form from "@radix-ui/react-form";
import "react-datepicker/dist/react-datepicker.css";

import DatePicker from "react-datepicker";

import {
    useState,
    Dispatch,
    SetStateAction,
    useCallback,
    useMemo
} from "react";
import { useRouter } from "next/navigation";
import { createBlocking } from "@/app/admin/blocking/actions";

const BlockingModal = ({
    showDemoModal,
    setShowDemoModal
}: {
    showDemoModal: boolean;
    setShowDemoModal: Dispatch<SetStateAction<boolean>>;
}) => {
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startIsOpen, setStartIsOpen] = useState(false);
    const [endIsOpen, setEndIsOpen] = useState(false);
    const [startDateError, setStartDateError] = useState(false);
    const [endDateError, setEndDateError] = useState(false);

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

    const checkIsDateEmpty = () => {
        let notEmpty = true;
        if (!startDate) {
            setStartDateError(true);
            notEmpty = false;
        }

        if (!endDate) {
            setEndDateError(true);
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
        setEndDateError(false);
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

                            const isDateEmpty = checkIsDateEmpty();
                            if (!isDateEmpty) {
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
                                const newBlocking = await createBlocking(
                                    name,
                                    new Date(startDate),
                                    new Date(endDate)
                                );

                                if (!newBlocking) {
                                    alert("The start and end are unavailable");
                                    return;
                                }

                                alert("Blocking created!");
                                setShowDemoModal(false);
                                router.refresh();
                            } catch (error) {
                                alert("Blocking created failed!");
                            }
                        }}
                    >
                        <Form.Field className="grid" name="Name">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "baseline",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Form.Label className="FormLabel">
                                    Name
                                </Form.Label>
                                <Form.Message
                                    className="FormMessage"
                                    match="valueMissing"
                                >
                                    Please enter blocking name
                                </Form.Message>
                            </div>
                            <Form.Control asChild>
                                <input
                                    id="name-input"
                                    className="Input"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </Form.Control>
                        </Form.Field>

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
                                        timeIntervals={60}
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
                                    End Date
                                </Form.Label>
                                {endDateError && (
                                    <span className="FormError">
                                        Please enter a end date
                                    </span> // Display error message
                                )}
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
                                        timeIntervals={60}
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
                                id="submit-button"
                                type="submit"
                                className="Button"
                                style={{ marginTop: 10 }}
                            >
                                Submit
                            </button>
                        </Form.Submit>
                    </Form.Root>
                </div>
            </div>
        </Modal>
    );
};

export function useBlockingModal() {
    const [showDemoModal, setShowDemoModal] = useState(false);

    const DemoModalCallback = useCallback(
        () => (
            <BlockingModal
                showDemoModal={showDemoModal}
                setShowDemoModal={setShowDemoModal}
            />
        ),
        [showDemoModal, setShowDemoModal]
    );

    return useMemo(
        () => ({ setShowDemoModal, DemoModal: DemoModalCallback }),
        [setShowDemoModal, DemoModalCallback]
    );
}
