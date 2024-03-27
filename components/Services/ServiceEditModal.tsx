/* eslint-disable no-alert */

"use client";

import Modal from "@/components/Shared/Modal";
import * as Form from "@radix-ui/react-form";
import "react-datepicker/dist/react-datepicker.css";

import {
    useState,
    Dispatch,
    SetStateAction,
    useCallback,
    useMemo
} from "react";
import { useRouter } from "next/navigation";
import {
    Duration,
    Interval,
    Service,
    ServiceCategory,
    Staff
} from "@prisma/client";
import DatePicker from "react-datepicker";

import { putService } from "../../app/admin/services/actions";

const ServiceEditModal = ({
    showDemoModal,
    setShowDemoModal,
    service,
    staffs
}: {
    showDemoModal: boolean;
    setShowDemoModal: Dispatch<SetStateAction<boolean>>;
    service: Service;
    staffs: Staff[];
}) => {
    const [name, setName] = useState(service?.name);
    const [price, setPrice] = useState(service?.price);
    const [description, setDescription] = useState(service.description ?? "");
    const [category, setCategory] = useState(service?.category.toString());
    const [interval, setInterval] = useState(service.interval.toString());
    const [duration, setDuration] = useState(service.duration.toString());

    const [startDate, setStartDate] = useState(
        service.startDate ? new Date(service.startDate) : ""
    );
    const [endDate, setEndDate] = useState(
        service.endDate ? new Date(service.endDate) : ""
    );
    const [startIsOpen, setStartIsOpen] = useState(false);
    const [endIsOpen, setEndIsOpen] = useState(false);
    const [startDateError, setStartDateError] = useState(false);
    const [endDateError, setEndDateError] = useState(false);

    const [staffIds] = useState(new Set(service.staffIds));

    const [startTime, setStartTime] = useState(service.startTime);
    const [endTime, setEndTime] = useState(service.endTime);

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
            <div className="max-h-screen w-full overflow-scroll md:max-w-md md:rounded-2xl md:border md:border-gray-100 md:shadow-xl">
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

                            if (staffIds.size < 0) {
                                alert(
                                    "You should select at least one designer"
                                );
                                return;
                            }

                            const assignedStaffs = Array.from(staffIds);

                            try {
                                await putService(
                                    service.id,
                                    name,
                                    price,
                                    description,
                                    new Date(startDate),
                                    endDate !== ""
                                        ? new Date(endDate)
                                        : undefined,
                                    startTime,
                                    endTime,
                                    assignedStaffs,
                                    Interval[interval],
                                    Duration[duration],
                                    ServiceCategory[category]
                                );
                                setShowDemoModal(false);
                                alert("Service has been updated!");

                                router.refresh();
                            } catch (error) {
                                alert("Service update failed!");
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
                                    Please enter service name
                                </Form.Message>
                                <Form.Message
                                    className="FormMessage"
                                    match="typeMismatch"
                                >
                                    Please provide a valid email
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

                        <Form.Field className="grid" name="price">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "baseline",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Form.Label className="FormLabel">
                                    Price
                                </Form.Label>
                                <Form.Message
                                    className="FormMessage"
                                    match="valueMissing"
                                >
                                    Please enter a price
                                </Form.Message>
                            </div>
                            <Form.Control asChild>
                                <input
                                    id="price-input"
                                    className="number dark:bg-black"
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                            </Form.Control>
                        </Form.Field>

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
                            </div>
                            <Form.Control asChild>
                                <textarea
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    className="max-h-96 min-h-16 dark:bg-black"
                                />
                            </Form.Control>
                        </Form.Field>

                        <Form.Field className="grid" name="category">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "baseline",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Form.Label className="FormLabel">
                                    Category
                                </Form.Label>
                            </div>
                            <select
                                value={category}
                                onChange={(e) => {
                                    setCategory(e.target.value);
                                }}
                                className="dark:bg-black"
                            >
                                {Object.keys(ServiceCategory).map((c) => (
                                    <option key={c} value={c.toString()}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </Form.Field>

                        <Form.Field className="grid" name="duration">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "baseline",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Form.Label className="FormLabel">
                                    Duration
                                </Form.Label>
                            </div>
                            <select
                                value={duration}
                                onChange={(e) => {
                                    setDuration(e.target.value);
                                }}
                            >
                                {Object.keys(Duration).map((d) => (
                                    <option key={d} value={d.toString()}>
                                        {d.replace("M", "")} minutes
                                    </option>
                                ))}
                            </select>
                        </Form.Field>

                        <Form.Field className="grid" name="interval">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "baseline",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Form.Label className="FormLabel">
                                    Interval
                                </Form.Label>
                            </div>
                            <select
                                value={interval}
                                onChange={(e) => {
                                    setInterval(e.target.value);
                                }}
                            >
                                {Object.keys(Interval).map((i) => (
                                    <option key={i} value={i.toString()}>
                                        {i.replace("M", "")} minutes
                                    </option>
                                ))}
                            </select>
                        </Form.Field>

                        <Form.Field className="grid" name="staffs">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "baseline",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Form.Label className="FormLabel">
                                    Staffs
                                </Form.Label>
                            </div>

                            <div className="flex flex-col text-left">
                                {staffs.map((s) => (
                                    <label htmlFor={s.id} key={s.id}>
                                        <input
                                            id={s.id}
                                            type="checkbox"
                                            name={s.name}
                                            defaultChecked={staffIds.has(s.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    staffIds.add(s.id);
                                                } else {
                                                    staffIds.delete(s.id);
                                                }
                                            }}
                                        />
                                        {s.name}
                                    </label>
                                ))}
                            </div>
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
                                        dateFormat="MMMM d, yyyy"
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
                                        dateFormat="MMMM d, yyyy"
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

                        <Form.Field className="grid" name="startTime">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "baseline",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Form.Label className="FormLabel">
                                    Start Time
                                </Form.Label>
                            </div>
                            <select
                                value={startTime}
                                onChange={(e) => {
                                    setStartTime(e.target.value);
                                }}
                            >
                                <option value="09:00">09:00</option>
                                <option value="10:00">10:00</option>
                                <option value="11:00">11:00</option>
                                <option value="12:00">12:00</option>
                                <option value="13:00">13:00</option>
                                <option value="14:00">14:00</option>
                                <option value="15:00">15:00</option>
                                <option value="16:00">16;00</option>
                                <option value="17:00">17:00</option>
                                <option value="18:00">18:00</option>
                                <option value="19:00">19:00</option>
                            </select>
                        </Form.Field>

                        <Form.Field className="grid" name="endTime">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "baseline",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Form.Label className="FormLabel">
                                    End Time
                                </Form.Label>
                            </div>
                            <select
                                value={endTime}
                                onChange={(e) => {
                                    setEndTime(e.target.value);
                                }}
                            >
                                <option value="09:00">09:00</option>
                                <option value="10:00">10:00</option>
                                <option value="11:00">11:00</option>
                                <option value="12:00">12:00</option>
                                <option value="13:00">13:00</option>
                                <option value="14:00">14:00</option>
                                <option value="15:00">15:00</option>
                                <option value="16:00">16:00</option>
                                <option value="17:00">17:00</option>
                                <option value="18:00">18:00</option>
                                <option value="19:00">19:00</option>
                            </select>
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

export function useServiceEditModal(service, staffs) {
    const [showDemoModal, setShowDemoModal] = useState(false);

    const DemoModalCallback = useCallback(
        () => (
            <ServiceEditModal
                showDemoModal={showDemoModal}
                setShowDemoModal={setShowDemoModal}
                service={service}
                staffs={staffs}
            />
        ),
        [showDemoModal, setShowDemoModal, service, staffs]
    );

    return useMemo(
        () => ({ setShowDemoModal, DemoModal: DemoModalCallback }),
        [setShowDemoModal, DemoModalCallback]
    );
}
