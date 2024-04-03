"use client";

import React, { useState, useEffect, useCallback } from "react";
import "@/components/PopUps/PopUp.module.css";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

type PopUp = {
    id: string;
    title: string;
    description: string;
    countdown: number;
    initialCountdown: number;
};

type PopUpsProps = {
    initialPopUps: PopUp[];
};

const PopUps: React.FC<PopUpsProps> = ({ initialPopUps }) => {
    const [activePopUps, setActivePopUps] = useState<PopUp[]>(
        initialPopUps.map((popUp) => ({
            ...popUp,
            initialCountdown: popUp.countdown // Set initialCountdown equal to countdown initially
        }))
    );

    const handleClose = useCallback((id: string) => {
        setActivePopUps((prev) => prev.filter((popUp) => popUp.id !== id));
    }, []);

    const handleOutsideClick = useCallback((event) => {
        const isClickInsidePopUp = event.target.closest(".popup-content");
        const isDoNotShowButtonClick = event.target.closest(
            '[name="doNotShowAgain"]'
        );

        if (!isClickInsidePopUp && !isDoNotShowButtonClick) {
            setActivePopUps((prevPopUps) => {
                // Remove the first popup in the array if there are any popups
                if (prevPopUps.length > 0) {
                    return prevPopUps.slice(1);
                }
                return prevPopUps;
            });
        }
    }, []);

    const handleDoNotShowAgainToday = useCallback(
        (id: string) => {
            const doNotShowAgainToday = JSON.parse(
                localStorage.getItem("doNotShowAgainToday") || "{}"
            );
            doNotShowAgainToday[id] = new Date().toDateString(); // Save the date when user opted to not show
            localStorage.setItem(
                "doNotShowAgainToday",
                JSON.stringify(doNotShowAgainToday)
            );

            handleClose(id); // Close the popup immediately after setting the preference
        },
        [handleClose]
    );

    // Adjust body scroll based on active pop-ups
    useEffect(() => {
        document.body.style.overflow =
            activePopUps.length > 0 ? "hidden" : "auto";

        if (activePopUps.length > 0) {
            document.addEventListener("click", handleOutsideClick);
        }
        return () => {
            document.body.style.overflow = "auto";
            // Remove the event listener when the component is unmounted or there are no active popups
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [activePopUps.length, handleOutsideClick]);

    // Countdown
    useEffect(() => {
        if (activePopUps.length > 0 && activePopUps[0].countdown > 0) {
            const timer = setTimeout(() => {
                setActivePopUps((current) =>
                    current
                        .map((popUp, index) =>
                            index === 0
                                ? { ...popUp, countdown: popUp.countdown - 1 }
                                : popUp
                        )
                        .filter((popUp, index) =>
                            index === 0 ? popUp.countdown > 0 : true
                        )
                );
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [activePopUps]);

    return (
        <div
            className={`fixed inset-0 ${activePopUps.length > 0 ? "z-40" : "z-0"}`}
        >
            {activePopUps.length > 0 && (
                <div className="absolute inset-0 z-30 bg-black opacity-50 dark:bg-gray-900"></div>
            )}
            <div
                className="custom-scrollbar relative z-50 overflow-auto"
                style={{ maxHeight: "100vh" }}
            >
                <div
                    className="flex flex-col items-center justify-center space-y-4 p-4"
                    style={{ minHeight: "100vh" }}
                >
                    {activePopUps.map((popUp) => (
                        <div
                            key={popUp.id}
                            className="custom-scrollbar-content flex flex-col items-center bg-white shadow-lg dark:bg-black dark:text-white"
                            style={{
                                minWidth: "300px",
                                maxWidth: "500px",
                                padding: "20px",
                                position: "relative"
                            }}
                        >
                            <Progress
                                value={
                                    (popUp.countdown / popUp.initialCountdown) *
                                    100
                                }
                                className="absolute top-0 max-h-1 rounded-none"
                            />

                            <h2
                                className="mb-4 break-all text-center text-xl font-bold"
                                style={{
                                    maxHeight: "80px",
                                    overflowY: "auto",
                                    margin: "20px 0"
                                }}
                            >
                                {popUp.title}
                            </h2>
                            <p
                                className="break-all text-center"
                                style={{
                                    maxHeight: "200px",
                                    overflowY: "auto",
                                    margin: "0 0 20px 0"
                                }}
                            >
                                {popUp.description}
                            </p>

                            <Button
                                className="text-sm font-normal"
                                variant="link"
                                id={`doNotShow-${popUp.id}`}
                                name="doNotShowAgain"
                                onClick={() =>
                                    handleDoNotShowAgainToday(popUp.id)
                                }
                            >
                                Don&apos;t show again today
                            </Button>

                            <button
                                onClick={() => handleClose(popUp.id)}
                                className="absolute right-0 top-0 m-2 p-1 text-2xl hover:text-gray-400"
                                style={{
                                    cursor: "pointer",
                                    lineHeight: "1",
                                    zIndex: 10
                                }}
                            >
                                &times; {/* Close Icon */}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PopUps;
