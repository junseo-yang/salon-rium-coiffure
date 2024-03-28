/* eslint-disable jsx-a11y/control-has-associated-label */
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
import { Appointment } from "@prisma/client";
import moment from "moment";
import {
    putAppointment,
    sendEmailAppointmentCancellation,
    sendEmailAppointmentConfirmation,
    sendTwilioAppointmentCancellation,
    sendTwilioAppointmentConfirmation
} from "../../app/admin/appointments/actions";
import {
    deleteGoogleCalendarEvent,
    insertGoogleCalendarEvent
} from "../../app/booking/actions";

const AppointmentEditModal = ({
    showDemoModal,
    setShowDemoModal,
    appointment
}: {
    showDemoModal: boolean;
    setShowDemoModal: Dispatch<SetStateAction<boolean>>;
    appointment: Appointment;
}) => {
    const [status, setStatus] = useState(appointment?.status);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    return (
        <Modal showModal={showDemoModal} setShowModal={setShowDemoModal}>
            <div className="w-full overflow-hidden md:max-w-md md:rounded-2xl md:border md:border-gray-100 md:shadow-xl">
                <div className="flex flex-col items-center justify-center space-y-3 bg-white px-4 py-6 pt-8 text-center dark:bg-black md:px-16">
                    <Form.Root
                        className="FormRoot"
                        onSubmit={async (event) => {
                            event.preventDefault();

                            setLoading(true);

                            try {
                                const updatedAppointment = await putAppointment(
                                    appointment.id,
                                    status
                                );

                                // If appointment is updated successfully, send the appointment request notification.
                                if (updatedAppointment.status === "confirmed") {
                                    // Send Email Notification
                                    await sendEmailAppointmentConfirmation(
                                        updatedAppointment.id,
                                        updatedAppointment.price,
                                        updatedAppointment.status,
                                        updatedAppointment.from_date,
                                        updatedAppointment.to_date,
                                        updatedAppointment.duration,
                                        updatedAppointment.customer_name,
                                        updatedAppointment.customer_number,
                                        updatedAppointment.customer_email,
                                        updatedAppointment.service_name,
                                        updatedAppointment.staff_name
                                    );

                                    // Send SMS Notification
                                    await sendTwilioAppointmentConfirmation(
                                        updatedAppointment.id,
                                        updatedAppointment.price,
                                        updatedAppointment.status,
                                        updatedAppointment.from_date,
                                        updatedAppointment.to_date,
                                        updatedAppointment.duration,
                                        updatedAppointment.customer_name,
                                        updatedAppointment.customer_number,
                                        updatedAppointment.customer_email,
                                        updatedAppointment.service_name,
                                        updatedAppointment.staff_name
                                    );

                                    // Insert Google Calendar Event
                                    await insertGoogleCalendarEvent(
                                        updatedAppointment.id,
                                        updatedAppointment.from_date,
                                        updatedAppointment.to_date,
                                        updatedAppointment.customer_name,
                                        updatedAppointment.customer_number,
                                        updatedAppointment.customer_email,
                                        updatedAppointment.service_name,
                                        updatedAppointment.staff_name
                                    );
                                } else if (
                                    updatedAppointment.status === "cancelled"
                                ) {
                                    // Send Email Notification
                                    await sendEmailAppointmentCancellation(
                                        updatedAppointment.id,
                                        updatedAppointment.price,
                                        updatedAppointment.status,
                                        updatedAppointment.from_date,
                                        updatedAppointment.to_date,
                                        updatedAppointment.duration,
                                        updatedAppointment.customer_name,
                                        updatedAppointment.customer_number,
                                        updatedAppointment.customer_email,
                                        updatedAppointment.service_name,
                                        updatedAppointment.staff_name
                                    );

                                    // Send SMS Notification
                                    await sendTwilioAppointmentCancellation(
                                        updatedAppointment.id,
                                        updatedAppointment.price,
                                        updatedAppointment.status,
                                        updatedAppointment.from_date,
                                        updatedAppointment.to_date,
                                        updatedAppointment.duration,
                                        updatedAppointment.customer_name,
                                        updatedAppointment.customer_number,
                                        updatedAppointment.customer_email,
                                        updatedAppointment.service_name,
                                        updatedAppointment.staff_name
                                    );

                                    // Insert Google Calendar Event
                                    await deleteGoogleCalendarEvent(
                                        updatedAppointment.id,
                                        updatedAppointment.google_calendar_event_id
                                    );
                                }

                                setLoading(false);
                                setShowDemoModal(false);
                                alert("Appointment has been updated!");

                                router.refresh();
                            } catch (error) {
                                setLoading(false);
                                alert("Appointment update failed!");
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
                                    price
                                </Form.Label>
                            </div>
                            <Form.Control asChild>
                                <input
                                    className="Input dark:bg-black"
                                    type="text"
                                    disabled
                                    value={appointment.price}
                                    required
                                />
                            </Form.Control>
                        </Form.Field>

                        <Form.Field className="grid" name="status">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "baseline",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Form.Label className="FormLabel">
                                    Status
                                </Form.Label>
                                <select
                                    id="status"
                                    value={status}
                                    onChange={(event) => {
                                        setStatus(event.target.value);
                                    }}
                                    className="dark:bg-black"
                                >
                                    <option value="pending">pending</option>
                                    <option value="confirmed">confirmed</option>
                                    <option value="cancelled">cancelled</option>
                                </select>
                            </div>
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
                                    Start At
                                </Form.Label>
                            </div>
                            <Form.Control asChild>
                                <input
                                    className="Input dark:bg-black"
                                    type="text"
                                    disabled
                                    value={moment(
                                        appointment.from_date
                                    ).toLocaleString()}
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
                                    End At
                                </Form.Label>
                            </div>
                            <Form.Control asChild>
                                <input
                                    className="Input dark:bg-black"
                                    type="text"
                                    disabled
                                    value={moment(
                                        appointment.to_date
                                    ).toLocaleString()}
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
                                    Duration
                                </Form.Label>
                            </div>
                            <Form.Control asChild>
                                <input
                                    className="Input dark:bg-black"
                                    type="text"
                                    disabled
                                    value={appointment.duration}
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
                                    Customer Name
                                </Form.Label>
                            </div>
                            <Form.Control asChild>
                                <input
                                    className="Input dark:bg-black"
                                    type="text"
                                    disabled
                                    value={appointment.customer_name}
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
                                    Customer Number
                                </Form.Label>
                            </div>
                            <Form.Control asChild>
                                <input
                                    className="Input dark:bg-black"
                                    type="text"
                                    disabled
                                    value={appointment.customer_number}
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
                                    Customer Email
                                </Form.Label>
                            </div>
                            <Form.Control asChild>
                                <input
                                    className="Input dark:bg-black"
                                    type="text"
                                    disabled
                                    value={appointment.customer_email}
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
                                    Service Name
                                </Form.Label>
                            </div>
                            <Form.Control asChild>
                                <input
                                    className="Input dark:bg-black"
                                    type="text"
                                    disabled
                                    value={appointment.service_name}
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
                                    Staff Name
                                </Form.Label>
                            </div>
                            <Form.Control asChild>
                                <input
                                    className="Input dark:bg-black"
                                    type="text"
                                    disabled
                                    value={appointment.staff_name}
                                    required
                                />
                            </Form.Control>
                        </Form.Field>

                        <Form.Submit asChild>
                            {loading ? (
                                <button disabled className="Button">
                                    <svg
                                        aria-hidden="true"
                                        role="status"
                                        className="me-3 inline h-4 w-4 animate-spin text-black"
                                        viewBox="0 0 100 101"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="#E5E7EB"
                                        />
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </button>
                            ) : (
                                <button
                                    id="submit-button"
                                    type="submit"
                                    className="Button hover:underline"
                                    style={{ marginTop: 10 }}
                                >
                                    Submit
                                </button>
                            )}
                        </Form.Submit>
                    </Form.Root>
                </div>
            </div>
        </Modal>
    );
};

export function useAppointmentEditModal(appointment) {
    const [showDemoModal, setShowDemoModal] = useState(false);

    const DemoModalCallback = useCallback(
        () => (
            <AppointmentEditModal
                showDemoModal={showDemoModal}
                setShowDemoModal={setShowDemoModal}
                appointment={appointment}
            />
        ),
        [showDemoModal, setShowDemoModal, appointment]
    );

    return useMemo(
        () => ({ setShowDemoModal, DemoModal: DemoModalCallback }),
        [setShowDemoModal, DemoModalCallback]
    );
}
