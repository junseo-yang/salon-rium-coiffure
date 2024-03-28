/* eslint-disable jsx-a11y/control-has-associated-label */
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
import {
    createAppointment,
    sendEmailAppointmentRequest,
    sendTwilioAppointmentRequest
} from "../../app/booking/actions";

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
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    return (
        <Modal showModal={showDemoModal} setShowModal={setShowDemoModal}>
            <div className="w-full overflow-hidden md:max-w-md md:rounded-2xl md:border md:border-gray-100 md:shadow-xl">
                <div className="flex flex-col items-center justify-center space-y-3 border bg-white px-4 py-6 pt-8 text-center dark:bg-black md:px-16">
                    <Form.Root
                        className="FormRoot"
                        onSubmit={async (event) => {
                            event.preventDefault();

                            setLoading(true);

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

                                // If appointment is created successfully, send the appointment request notification.
                                if (appointment) {
                                    // Send Email Notification
                                    await sendEmailAppointmentRequest(
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

                                    // Send SMS Notification
                                    await sendTwilioAppointmentRequest(
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

                                setLoading(false);
                                setShowDemoModal(false);
                                alert("Appointment has been created!");

                                router.push(
                                    `/booking/confirmation?appointment_id=${appointment.id}`
                                );

                                //
                            } catch (error) {
                                setLoading(false);
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
                                    className="Input dark:bg-black"
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
                                    className="number dark:bg-black"
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
                                    className="dark:bg-black"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
