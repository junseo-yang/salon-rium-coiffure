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
import { Service, ServiceCategory } from "@prisma/client";
import { putService } from "../../app/admin/services/actions";

const ServiceEditModal = ({
    showDemoModal,
    setShowDemoModal,
    service
}: {
    showDemoModal: boolean;
    setShowDemoModal: Dispatch<SetStateAction<boolean>>;
    service: Service;
}) => {
    const [name, setName] = useState(service?.name);
    const [price, setPrice] = useState(service?.price);
    const [description, setDescription] = useState(service.description ?? "");
    const [category, setCategory] = useState(service?.category.toString());

    const router = useRouter();

    return (
        <Modal showModal={showDemoModal} setShowModal={setShowDemoModal}>
            <div className="w-full overflow-hidden md:max-w-md md:rounded-2xl md:border md:border-gray-100 md:shadow-xl">
                <div className="flex flex-col items-center justify-center space-y-3 bg-white px-4 py-6 pt-8 text-center dark:bg-black md:px-16">
                    <Form.Root
                        className="FormRoot"
                        onSubmit={async (event) => {
                            event.preventDefault();

                            try {
                                await putService(
                                    service.id,
                                    name,
                                    price,
                                    description,
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

export function useServiceEditModal(service) {
    const [showDemoModal, setShowDemoModal] = useState(false);

    const DemoModalCallback = useCallback(
        () => (
            <ServiceEditModal
                showDemoModal={showDemoModal}
                setShowDemoModal={setShowDemoModal}
                service={service}
            />
        ),
        [showDemoModal, setShowDemoModal, service]
    );

    return useMemo(
        () => ({ setShowDemoModal, DemoModal: DemoModalCallback }),
        [setShowDemoModal, DemoModalCallback]
    );
}
