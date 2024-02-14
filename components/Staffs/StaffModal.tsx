/* eslint-disable no-alert */
import Modal from "@/components/Shared/Modal";
import * as Form from "@radix-ui/react-form";

import {
    useState,
    useCallback,
    useMemo
} from "react";
import { useRouter } from "next/navigation";
import { Roles } from "@prisma/client";
import { createStaff } from "../../app/admin/staffs/actions"; 

const StaffModal = ({
    showDemoModal,
    setShowDemoModal
}: {
    showDemoModal,
    setShowDemoModal
}) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [role, setRole] = useState(Roles.Designer.toString());

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
                                await createStaff(
                                    name,
                                    description,
                                    Roles[role]
                                );
                                setShowDemoModal(false);
                                alert("Staff member created!");

                                router.refresh();
                            } catch (error) {
                                alert("Failed to create staff member!");
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
                                <Form.Label>Name</Form.Label>
                                <Form.Message
                                    className="FormMessage"
                                    match="valueMissing"
                                >
                                    Please enter staff name
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

export function useStaffModal() {
    const [showDemoModal, setShowDemoModal] = useState(false);

    const DemoModalCallback = useCallback(
        () => (
            <StaffModal
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
