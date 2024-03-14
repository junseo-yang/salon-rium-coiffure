/* eslint-disable no-alert */
import Modal from "@/components/Shared/Modal";
import * as Form from "@radix-ui/react-form";

import {
    useState,
    Dispatch,
    SetStateAction,
    useCallback,
    useMemo
} from "react";
import { Service, Staff } from "@prisma/client";
import { useRouter } from "next/navigation";
import { createAppointment, sendEmailAppointmentRequest } from "./actions";

const BookingModal = ({
    showDemoModal,
    setShowDemoModal,
    service,
    designer,
    selectedDate,
    selectedTime
}: {
    showDemoModal: boolean;
    setShowDemoModal: Dispatch<SetStateAction<boolean>>;
    service: Service;
    designer: Staff;
    selectedDate: string;
    selectedTime: string;
}) => {
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");

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
                                const appointment = await createAppointment(
                                    service,
                                    designer,
                                    selectedTime,
                                    selectedDate,
                                    name,
                                    phoneNumber,
                                    email
                                );

                                // If appointment is created successfully, send the appointment request emails.
                                if (appointment) {
                                    sendEmailAppointmentRequest(
                                        appointment.id,
                                        appointment.price,
                                        appointment.status,
                                        appointment.from_date,
                                        appointment.to_date,
                                        appointment.duration,
                                        appointment.customer_name,
                                        appointment.customer_number,
                                        appointment.customer_email,
                                        appointment.service_name,
                                        appointment.staff_name
                                    );
                                }

                                alert("Appointment has been created!");
                                setShowDemoModal(false);

                                router.push(
                                    `/booking/confirmation?appointment_id=${appointment.id}`
                                );

                                //
                            } catch (error) {
                                alert("Appointment create failed!");
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
                                    Please enter name
                                </Form.Message>
                                <Form.Message
                                    className="FormMessage"
                                    match="typeMismatch"
                                >
                                    Please provide a name
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

                        <Form.Field className="mt-3 grid" name="phoneNumber">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "baseline",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Form.Label className="FormLabel">
                                    Phone Number
                                </Form.Label>
                                <Form.Message
                                    className="FormMessage"
                                    match="valueMissing"
                                >
                                    Please enter a phone number
                                </Form.Message>
                            </div>
                            <Form.Control asChild>
                                <input
                                    id="phone-number-input"
                                    className="number"
                                    value={phoneNumber}
                                    onChange={(e) =>
                                        setPhoneNumber(e.target.value)
                                    }
                                    required
                                />
                            </Form.Control>
                        </Form.Field>

                        <Form.Field className="mt-3 grid" name="email">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "baseline",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Form.Label className="FormLabel">
                                    Email
                                </Form.Label>
                                <Form.Message
                                    className="FormMessage"
                                    match="valueMissing"
                                >
                                    Please enter a email
                                </Form.Message>
                            </div>
                            <Form.Control asChild>
                                <input
                                    id="email-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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

export function useBookingModal(
    service: Service,
    designer: Staff,
    selectedDate: string,
    selectedTime: string
) {
    const [showDemoModal, setShowDemoModal] = useState(false);

    const DemoModalCallback = useCallback(
        () => (
            <BookingModal
                showDemoModal={showDemoModal}
                setShowDemoModal={setShowDemoModal}
                service={service}
                designer={designer}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
            />
        ),
        [
            showDemoModal,
            setShowDemoModal,
            service,
            designer,
            selectedDate,
            selectedTime
        ]
    );

    return useMemo(
        () => ({ setShowDemoModal, DemoModal: DemoModalCallback }),
        [setShowDemoModal, DemoModalCallback]
    );
}
