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
import { createBreak } from "@/app/admin/breaks/actions";
import { Staff } from "@prisma/client";

const BreakModal = ({
    showDemoModal,
    setShowDemoModal,
    staffs
}: {
    showDemoModal: boolean;
    setShowDemoModal: Dispatch<SetStateAction<boolean>>;
    staffs: Staff[];
}) => {
    const [name, setName] = useState("");
    const [staffName, setStaffName] = useState(staffs[0]?.name);
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
                <div className="flex flex-col items-center justify-center space-y-3 bg-white px-4 py-6 pt-8 text-center dark:bg-black md:px-16">
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

                            const selectStaff = staffs.find(
                                (s) => s.name === staffName
                            );

                            if (!selectStaff) {
                                alert("Select staff please");
                                return;
                            }

                            try {
                                const newBreak = await createBreak(
                                    name,
                                    selectStaff,
                                    new Date(startDate),
                                    new Date(endDate)
                                );

                                if (!newBreak) {
                                    alert("The start and end are unavailable");
                                    return;
                                }

                                alert("Break created!");
                                setShowDemoModal(false);
                                router.refresh();
                            } catch (error) {
                                alert("Break created failed!");
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
                                    Please enter break name
                                </Form.Message>
                            </div>
                            <Form.Control asChild>
                                <input
                                    id="name-input"
                                    className="Input dark:bg-black"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </Form.Control>
                        </Form.Field>

                        <Form.Field className="grid" name="staff">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "baseline",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Form.Label className="FormLabel">
                                    Staff
                                </Form.Label>
                            </div>
                            <select
                                id="staff"
                                value={staffName}
                                onChange={(e) => {
                                    setStaffName(e.target.value);
                                }}
                                className="dark:bg-black"
                            >
                                {staffs.map((s) => (
                                    <option key={s.id} value={s.name}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
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
                                        className="Input dark:bg-black"
                                        disabled
                                    />
                                    <div>
                                        <button
                                            type="button"
                                            onClick={toggleStartDatePicker}
                                            id="start-date-button"
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
                                        className="Input dark:bg-black"
                                        disabled
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
                                id="submit-button"
                                type="submit"
                                className="Button hover:underline"
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

export function useBreakModal(staffs: Staff[]) {
    const [showDemoModal, setShowDemoModal] = useState(false);

    const DemoModalCallback = useCallback(
        () => (
            <BreakModal
                showDemoModal={showDemoModal}
                setShowDemoModal={setShowDemoModal}
                staffs={staffs}
            />
        ),
        [showDemoModal, setShowDemoModal, staffs]
    );

    return useMemo(
        () => ({ setShowDemoModal, DemoModal: DemoModalCallback }),
        [setShowDemoModal, DemoModalCallback]
    );
}
