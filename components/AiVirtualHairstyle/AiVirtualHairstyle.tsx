"use client";

import { useEffect, useRef, useState } from "react";
import Balancer from "react-wrap-balancer";
import { ChevronDown, Download, Upload, AlertCircle } from "lucide-react";
import { request } from "@/app/ai-virtual-hairstyle/actions";
import { COLORS, HAIRSTYLES } from "@/lib/constants";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import Image from "next/image";
import * as Toast from "@radix-ui/react-toast";
import "./styles.css";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger
} from "@/components/ui/hover-card";
import ImagePlaceHolder from "../Shared/ImagePlaceholder";
import AiVirtualHairstylePopover from "./AiVirtualHairstylePopover";

export default function AiVirtualHairstyle() {
    const MIN_HEIGHT = 200;
    const MAX_HEIGHT = 2000;
    const MIN_WIDTH = 200;
    const MAX_WIDTH = 2000;
    const MAX_SIZE = 3145728;

    const [hairstyle, setHairstyle] = useState("");
    const [hairstyleDescription, setHairstyleDescription] = useState("");
    const [color, setColor] = useState("");
    const [colorDescription, setColorDescription] = useState("");
    const [before, setBefore] = useState<any>(null);
    const [after, setAfter] = useState("");
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [openHairstylePopover, setOpenHairstylePopover] = useState(false);
    const [openColorPopover, setOpenColorPopover] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState("");
    const [openToast, setOpenToast] = useState(false);
    const timerRef = useRef(0);

    const isValid = () => {
        // Validation
        // 1. Params
        // 2. Image Resolution and Size
        if (
            !before ||
            !hairstyle ||
            !color ||
            height < MIN_HEIGHT ||
            height > MAX_HEIGHT ||
            width < MIN_WIDTH ||
            width > MAX_WIDTH ||
            before.size > MAX_SIZE
        ) {
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        // Validation
        if (!isValid()) {
            setError(
                "Image, Hairstyle, or Color is empty.\nImage resolution should be larger than 200x200px, smaller than 2000x2000px, and less than 3 MB."
            );
            setOpenToast(true);
            return;
        }

        setGenerating(true);
        setDone(false);

        try {
            const formData = new FormData(event.currentTarget);
            const response = await request(formData);

            if (response.error) {
                setError(response.error);
                setOpenToast(true);
                setGenerating(false);
            } else {
                setAfter(response);
                setDone(true);
                setGenerating(false);
            }
        } catch (e) {
            setError("Unexpected error happened. Contact to Admin.");
            setOpenToast(true);
            setGenerating(false);
        }
    };

    const download = async () => {
        try {
            const response = await fetch(after, {
                method: "GET",
                headers: {
                    "Content-Type": "application/jpeg"
                }
            });
            const data = await response.blob();

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement("a");
            const filename = `Rium_Salon_Coiffure_Ai_Virtual_Hairstyle_${Date.now()}.jpeg`;
            link.href = url;
            link.setAttribute("download", filename);

            // Append to html link element page
            document.body.appendChild(link);

            // Start download
            link.click();

            // Clean up and remove the link
            link.parentNode?.removeChild(link);
        } catch (e) {
            setError("Unexpected error happened. Contact to Admin.");
            setOpenToast(true);
        }
    };

    useEffect(() => () => clearTimeout(timerRef.current), []);

    return (
        <>
            <div
                className="my-10 w-full max-w-screen-xl animate-fade-up gap-5 px-5 opacity-0 xl:px-0"
                style={{
                    animationDelay: "0.3s", // Adjust the delay as needed
                    animationFillMode: "forwards"
                }}
            >
                <div className="relative rounded-xl border border-gray-200 shadow-md">
                    <div className="mx-auto w-full p-6 text-center">
                        <h2 className="flex items-center justify-center bg-clip-text font-display text-xl font-bold md:text-3xl md:font-normal">
                            <Balancer>Ai Virtual Hairstyle</Balancer>
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mt-3 grid justify-items-center gap-5">
                                {/* Hairstyle */}
                                <div>
                                    <AiVirtualHairstylePopover
                                        content={
                                            <ScrollArea.Root className="ScrollAreaRoot">
                                                <ScrollArea.Viewport className="ScrollAreaViewport">
                                                    <div
                                                        style={{
                                                            padding: "10px 10px"
                                                        }}
                                                    >
                                                        <div className="Text">
                                                            Female
                                                        </div>
                                                        {HAIRSTYLES.filter(
                                                            (h) =>
                                                                h.gender ===
                                                                "Female"
                                                        ).map((h) => (
                                                            <button
                                                                key={
                                                                    h.hair_style
                                                                }
                                                                className="flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100 active:bg-gray-200"
                                                                onClick={() => {
                                                                    setHairstyle(
                                                                        h.hair_style
                                                                    );
                                                                    setHairstyleDescription(
                                                                        h.description
                                                                    );
                                                                    setOpenHairstylePopover(
                                                                        !openHairstylePopover
                                                                    );
                                                                }}
                                                            >
                                                                <p>
                                                                    {
                                                                        h.description
                                                                    }
                                                                </p>
                                                            </button>
                                                        ))}
                                                        <div className="Text">
                                                            Male
                                                        </div>
                                                        {HAIRSTYLES.filter(
                                                            (h) =>
                                                                h.gender ===
                                                                "Male"
                                                        ).map((h) => (
                                                            <button
                                                                key={
                                                                    h.hair_style
                                                                }
                                                                className="flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100 active:bg-gray-200"
                                                                onClick={() => {
                                                                    setHairstyle(
                                                                        h.hair_style
                                                                    );
                                                                    setHairstyleDescription(
                                                                        h.description
                                                                    );
                                                                    setOpenColorPopover(
                                                                        !openColorPopover
                                                                    );
                                                                }}
                                                            >
                                                                <p>
                                                                    {
                                                                        h.description
                                                                    }
                                                                </p>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </ScrollArea.Viewport>
                                                <ScrollArea.Scrollbar
                                                    className="ScrollAreaScrollbar"
                                                    orientation="vertical"
                                                >
                                                    <ScrollArea.Thumb className="ScrollAreaThumb" />
                                                </ScrollArea.Scrollbar>
                                                <ScrollArea.Scrollbar
                                                    className="ScrollAreaScrollbar"
                                                    orientation="horizontal"
                                                >
                                                    <ScrollArea.Thumb className="ScrollAreaThumb" />
                                                </ScrollArea.Scrollbar>
                                                <ScrollArea.Corner className="ScrollAreaCorner" />
                                            </ScrollArea.Root>
                                        }
                                        openPopover={openHairstylePopover}
                                        setOpenPopover={setOpenHairstylePopover}
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setOpenHairstylePopover(
                                                    !openHairstylePopover
                                                )
                                            }
                                            className="w-55 flex items-center justify-between rounded-md border border-gray-300 px-4 py-2 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100"
                                        >
                                            <p>
                                                {hairstyleDescription ||
                                                    "Select a Hairstyle"}
                                            </p>
                                            <ChevronDown
                                                className={`ml-2 h-4 w-4 transition-all ${
                                                    openHairstylePopover
                                                        ? "rotate-180"
                                                        : ""
                                                }`}
                                            />
                                        </button>
                                    </AiVirtualHairstylePopover>
                                    <input
                                        type="text"
                                        name="hair_style"
                                        id="hair_style"
                                        value={hairstyle || ""}
                                        onChange={() => setHairstyle(hairstyle)}
                                        hidden
                                    />
                                </div>
                                {/* Color */}
                                <div>
                                    <AiVirtualHairstylePopover
                                        content={
                                            <ScrollArea.Root className="ScrollAreaRoot">
                                                <ScrollArea.Viewport className="ScrollAreaViewport">
                                                    <div
                                                        style={{
                                                            padding: "10px 10px"
                                                        }}
                                                    >
                                                        <div className="Text">
                                                            Color
                                                        </div>
                                                        {COLORS.map((c) => (
                                                            <button
                                                                key={c.color}
                                                                className="flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100 active:bg-gray-200"
                                                                onClick={() => {
                                                                    setColor(
                                                                        c.color
                                                                    );
                                                                    setColorDescription(
                                                                        c.description
                                                                    );
                                                                    setOpenColorPopover(
                                                                        !openColorPopover
                                                                    );
                                                                }}
                                                            >
                                                                <p>
                                                                    {
                                                                        c.description
                                                                    }
                                                                </p>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </ScrollArea.Viewport>
                                                <ScrollArea.Scrollbar
                                                    className="ScrollAreaScrollbar"
                                                    orientation="vertical"
                                                >
                                                    <ScrollArea.Thumb className="ScrollAreaThumb" />
                                                </ScrollArea.Scrollbar>
                                                <ScrollArea.Scrollbar
                                                    className="ScrollAreaScrollbar"
                                                    orientation="horizontal"
                                                >
                                                    <ScrollArea.Thumb className="ScrollAreaThumb" />
                                                </ScrollArea.Scrollbar>
                                                <ScrollArea.Corner className="ScrollAreaCorner" />
                                            </ScrollArea.Root>
                                        }
                                        openPopover={openColorPopover}
                                        setOpenPopover={setOpenColorPopover}
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setOpenColorPopover(
                                                    !openColorPopover
                                                )
                                            }
                                            className="w-55 flex items-center justify-between rounded-md border border-gray-300 px-4 py-2 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100"
                                        >
                                            <p>
                                                {colorDescription ||
                                                    "Select a Color"}
                                            </p>
                                            <ChevronDown
                                                className={`ml-2 h-4 w-4 transition-all ${
                                                    openColorPopover
                                                        ? "rotate-180"
                                                        : ""
                                                }`}
                                            />
                                        </button>
                                    </AiVirtualHairstylePopover>
                                    <input
                                        type="text"
                                        name="color"
                                        id="color"
                                        value={color || ""}
                                        onChange={() => setColor(color)}
                                        hidden
                                    />
                                </div>
                                {/* Image */}
                                <div className="flex">
                                    <input
                                        className="group relative block w-full min-w-0 max-w-fit flex-auto items-center justify-center space-x-2 rounded-full border border-black bg-clip-padding px-3 py-[0.32rem] text-sm font-normal text-black transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-black file:px-3 file:py-[0.32rem] file:text-white file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:cursor-pointer hover:file:cursor-pointer hover:file:bg-white hover:file:text-black dark:border-white dark:text-white"
                                        type="file"
                                        id="image"
                                        name="image"
                                        onChange={(e) =>
                                            setBefore(
                                                e.target.files
                                                    ? e.target.files[0]
                                                    : null
                                            )
                                        }
                                        accept=".png,.jpg,.jpeg"
                                    />
                                    <HoverCard>
                                        <HoverCardTrigger>
                                            <AlertCircle />
                                        </HoverCardTrigger>
                                        <HoverCardContent>
                                            <h6>Image Requirements</h6>
                                            <div className="text-center text-sm">
                                                <ul>
                                                    <li>
                                                        Image resolution: Larger
                                                        than 200x200px, smaller
                                                        than 1999x1999px.
                                                    </li>
                                                    <li>
                                                        Minimum Face Proportion:
                                                        The proportion of the
                                                        face in the image cannot
                                                        be less than 20%.
                                                    </li>
                                                    <li>
                                                        Facial Integrity: The
                                                        face in the image should
                                                        ideally not be obscured.
                                                    </li>
                                                    <li>
                                                        Facial Angle: The face
                                                        in the image should
                                                        ideally be front-facing,
                                                        with no more than a
                                                        45-degree rotation to
                                                        the left or right.
                                                    </li>
                                                    <li>
                                                        <a
                                                            href="https://www.ailabtools.com/doc/ai-portrait/effects/hairstyle-editor-pro/api-v200"
                                                            target="_blank"
                                                        >
                                                            Click here for more
                                                            information.
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </HoverCardContent>
                                    </HoverCard>
                                </div>
                                {/* Buttons */}
                                <div>
                                    {generating ? (
                                        <button
                                            disabled
                                            className="group flex max-w-fit items-center justify-center space-x-2 rounded-full border border-black bg-black px-5 py-2 text-sm text-white transition-colors dark:border-white"
                                        >
                                            <svg
                                                aria-hidden="true"
                                                role="status"
                                                className="me-3 inline h-4 w-4 animate-spin text-white"
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
                                            Generating...
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            className="group flex max-w-fit items-center justify-center space-x-2 rounded-full border border-black bg-black px-5 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black dark:border-white"
                                        >
                                            <Upload className="mr-2 h-4 w-4" />
                                            <span>Try the Hairstyle</span>
                                        </button>
                                    )}
                                </div>
                                <div>
                                    {done ? (
                                        <button
                                            type="button"
                                            onClick={() => download()}
                                            className="group flex max-w-fit items-center justify-center space-x-2 rounded-full border border-black bg-black px-5 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black dark:border-white"
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            <span>Download</span>
                                        </button>
                                    ) : null}
                                </div>
                                {/* Before/After */}
                                <div className="z-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div>
                                        <h3>
                                            <Balancer>Before</Balancer>
                                        </h3>
                                        <div className="flex">
                                            {before ? (
                                                <Image
                                                    className="rounded-md"
                                                    width={0}
                                                    height={0}
                                                    sizes="100vw"
                                                    style={{
                                                        width: "100%",
                                                        height: "auto"
                                                    }}
                                                    id="before"
                                                    src={URL.createObjectURL(
                                                        before
                                                    )}
                                                    alt="Before image"
                                                    onLoad={(e) => {
                                                        setWidth(
                                                            (
                                                                e.target as HTMLImageElement
                                                            ).naturalWidth
                                                        );
                                                        setHeight(
                                                            (
                                                                e.target as HTMLImageElement
                                                            ).naturalHeight
                                                        );
                                                    }}
                                                />
                                            ) : (
                                                <ImagePlaceHolder />
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h3>
                                            <Balancer>After</Balancer>
                                        </h3>
                                        {after ? (
                                            <Image
                                                className="rounded-md"
                                                width={0}
                                                height={0}
                                                sizes="100vw"
                                                style={{
                                                    width: "100%",
                                                    height: "auto"
                                                }}
                                                id="after"
                                                src={after}
                                                alt="After image"
                                            />
                                        ) : (
                                            <ImagePlaceHolder />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Error Display Toast */}
            <Toast.Provider swipeDirection="right">
                <Toast.Root
                    className="ToastRoot dark:bg-black dark:text-white"
                    open={openToast}
                    onOpenChange={setOpenToast}
                >
                    <Toast.Title className="ToastTitle">Error</Toast.Title>
                    <Toast.Description asChild>
                        <div className="ToastDescription">{error}</div>
                    </Toast.Description>
                </Toast.Root>
                <Toast.Viewport className="ToastViewport" />
            </Toast.Provider>
        </>
    );
}
