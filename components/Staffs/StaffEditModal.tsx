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
import { Staff, Roles } from "@prisma/client";
import { putStaff } from "../../app/admin/staffs/actions";


const StaffEditModal = ({
    showDemoModal,
    setShowDemoModal,
    staff
}: {
    showDemoModal: boolean;
    setShowDemoModal: Dispatch<SetStateAction<boolean>>;
    staff: Staff; 
}) => {
    const [name, setName] = useState(staff?.name);
    const [description, setDescription] = useState(staff.description ?? "");
    const [role, setRole] = useState(staff?.role.toString());

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
                                await putStaff(
                                    staff.id,
                                    name,
                                    description,
                                    Roles[role]
                                );
                                setShowDemoModal(false);
                                alert("Staff member has been updated!");

                                router.refresh();
                            } catch (error) {
                                alert("Failed to update staff member!");
                            }
                        }}
                    >
                        {/* Name Field */}
                        <Form.Field className="grid" name="name">
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
                                    Please enter staff name
                                </Form.Message>
                            </div>
                            <Form.Control asChild>
                                <input
                                    className="Input"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
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
                        </div>
                            <Form.Control asChild>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </Form.Control>
                        </Form.Field>

                        {/* Role Field */}
                        <Form.Field className="grid" name="role">
                        <div
                                style={{
                                    display: "flex",
                                    alignItems: "baseline",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Form.Label className="FormLabel">
                                    Role
                                </Form.Label>
                        </div>

                                <select
                                    value={role}
                                    onChange={(e) => {
                                        setRole(e.target.value);
                                    }}
                                >
                                {Object.keys(Roles).map((c) => (
                                    <option key={c} value={c.toString()}>
                                        {c}
                                    </option>
                                ))}
                                </select>

                        </Form.Field>

                        <Form.Submit asChild>
                            <button
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

export function useStaffEditModal(staff) {
    const [showDemoModal, setShowDemoModal] = useState(false);

    const DemoModalCallback = useCallback(
        () => (
            <StaffEditModal
                showDemoModal={showDemoModal}
                setShowDemoModal={setShowDemoModal}
                staff={staff}
            />
        ),
        [showDemoModal, setShowDemoModal, staff]
    );

    return useMemo(
        () => ({ setShowDemoModal, DemoModal: DemoModalCallback }),
        [setShowDemoModal, DemoModalCallback]
    );
}
