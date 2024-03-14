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
    sendEmailAppointmentConfirmation
} from "../../app/admin/appointments/actions";

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

    const router = useRouter();

    return (
        <Modal showModal={showDemoModal} setShowModal={setShowDemoModal}>
            <div className="w-full overflow-hidden md:max-w-md md:rounded-2xl md:border md:border-gray-100 md:shadow-xl">
                <div className="flex flex-col items-center justify-center space-y-3 bg-white px-4 py-6 pt-8 text-center md:px-16">
                    <Form.Root
                        className="FormRoot"
                        onSubmit={async (event) => {
                            event.preventDefault();

                            try {
                                const updatedAppointment = await putAppointment(
                                    appointment.id,
                                    status
                                );

                                if (
                                    appointment.status === "pending" &&
                                    updatedAppointment.status === "approved"
                                ) {
                                    sendEmailAppointmentConfirmation(
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
                                }

                                setShowDemoModal(false);
                                alert("Appointment has been updated!");

                                router.refresh();
                            } catch (error) {
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
                                    className="Input"
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
                                >
                                    <option value="approved">approved</option>
                                    <option value="pending">pending</option>
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
                                    className="Input"
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
                                    className="Input"
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
                                    className="Input"
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
                                    className="Input"
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
                                    className="Input"
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
                                    className="Input"
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
                                    className="Input"
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
                                    className="Input"
                                    type="text"
                                    disabled
                                    value={appointment.staff_name}
                                    required
                                />
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
