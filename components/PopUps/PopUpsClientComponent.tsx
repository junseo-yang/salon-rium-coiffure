"use client";

import React, { useState, useEffect, useCallback } from "react";
import "@/components/PopUps/PopUp.module.css";

type PopUp = {
    id: string;
    title: string;
    description: string;
    countdown: number;
};

type PopUpsClientComponentProps = {
    initialPopUps: PopUp[];
};

const PopUpsClientComponent: React.FC<PopUpsClientComponentProps> = ({
    initialPopUps
}) => {
    const [activePopUps, setActivePopUps] = useState<PopUp[]>(initialPopUps);

    const handleClose = useCallback((id: string) => {
        setActivePopUps((prev) => prev.filter((popUp) => popUp.id !== id));
    }, []);

    // Adjust body scroll based on active pop-ups
    useEffect(() => {
        document.body.style.overflow =
            activePopUps.length > 0 ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [activePopUps.length]);

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
                <div className="absolute inset-0 z-30 bg-black opacity-50"></div>
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
                            className="custom-scrollbar-content flex flex-col items-center rounded-lg bg-white shadow-lg"
                            style={{
                                minWidth: "300px",
                                maxWidth: "500px",
                                padding: "20px",
                                position: "relative"
                            }}
                        >
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
                            <button
                                onClick={() => handleClose(popUp.id)}
                                className="absolute right-1 top-1 m-2 p-1 text-2xl"
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

export default PopUpsClientComponent;
