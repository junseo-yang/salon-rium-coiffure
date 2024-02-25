"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';

type PopUp = {
    id: string;
    title: string;
    description: string;
    countdown: number;
};

type PopUpsClientComponentProps = {
    initialPopUps: PopUp[];
};

const PopUpsClientComponent: React.FC<PopUpsClientComponentProps> = ({ initialPopUps }) => {
    // Initialize each pop-up with a countdown
    const initializedPopUps = initialPopUps.map(popUp => ({ ...popUp, countdown: 5 }));
    const [activePopUps, setActivePopUps] = useState<PopUp[]>(initializedPopUps);
    const popUpContainerRef = useRef<HTMLDivElement | null>(null); 


    const handleClose = useCallback((id: string) => {
        setActivePopUps(activePopUps.filter(popUp => popUp.id !== id));
    }, [activePopUps]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popUpContainerRef.current && !popUpContainerRef.current.contains(event.target as Node)) {
                // If click is outside the pop-up container, close the top-most pop-up
                if (activePopUps.length > 0) {
                    handleClose(activePopUps[0].id);
                }
            }
        };

        // Add event listener
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Clean up event listener
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activePopUps, handleClose]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (activePopUps.length > 0) {
            timer = setInterval(() => {
                setActivePopUps(currentPopUps =>
                    currentPopUps.map((popUp, index) => 
                        index === 0 ? { ...popUp, countdown: popUp.countdown > 0 ? popUp.countdown - 1 : 0 } : popUp
                    )
                );
            }, 1000);

            const autoCloseTimer = setTimeout(() => {
                if (activePopUps.length > 0) {
                    handleClose(activePopUps[0].id);
                }
            }, (activePopUps[0]?.countdown ?? 0) * 1000); // Use the countdown of the top-most pop-up

            return () => {
                clearTimeout(autoCloseTimer);
                clearInterval(timer);
            };
        }
    }, [activePopUps, handleClose]);

    return (
        <div className={`fixed inset-0 ${activePopUps.length > 0 ? 'z-50' : 'z-0'} flex items-center justify-center px-4 py-8`}>
            {activePopUps.length > 0 && <div className="absolute inset-0 bg-black opacity-50"></div>}
            <div ref={popUpContainerRef} className="flex flex-col items-center justify-start space-y-4">
                {activePopUps.map((popUp, index) => (
                    <div 
                        key={popUp.id} 
                        className={`min-w-[300px] min-h-[150px] max-w-lg w-full bg-white rounded-lg shadow-lg p-8 relative flex flex-col items-center ${
                            index !== 0 ? 'mt-4' : ''
                        }`}
                        style={{ zIndex: 1000 - index }}
                    >
                        {index === 0 && <div className="absolute top-0 left-0 p-2 text-xs">Closing in {popUp.countdown}...</div>}
                        <h2 className="text-xl font-bold text-center mb-4">{popUp.title}</h2>
                        <p className="text-center">{popUp.description}</p>
                        <button
                            onClick={() => handleClose(popUp.id)}
                            className="absolute top-0 right-0 m-2 text-2xl p-2"
                            style={{ cursor: 'pointer', lineHeight: '1' }}
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PopUpsClientComponent;
