"use client";

import React, { useEffect, useState } from "react";
import PopUps from "./PopUps";

const PopUpsManager = ({ popUps }) => {
    const [shouldShowPopUps, setShouldShowPopUps] = useState([]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const currentTime = new Date().getTime();
            const shownPopUpTimes = JSON.parse(
                localStorage.getItem("shownPopUpTimes") || "{}"
            );
            const twelveHours = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

            const newEligiblePopUps = popUps.filter((popUp) => {
                const lastShownTime = shownPopUpTimes[popUp.id];
                return (
                    !lastShownTime || currentTime - lastShownTime > twelveHours
                );
            });

            if (newEligiblePopUps.length > 0) {
                // Update shown time for eligible pop-ups
                newEligiblePopUps.forEach((popUp) => {
                    shownPopUpTimes[popUp.id] = currentTime;
                });

                localStorage.setItem(
                    "shownPopUpTimes",
                    JSON.stringify(shownPopUpTimes)
                );
                setShouldShowPopUps(newEligiblePopUps);
            }
        }
    }, [popUps]);

    return shouldShowPopUps.length > 0 ? (
        <PopUps initialPopUps={shouldShowPopUps} />
    ) : null;
};

export default PopUpsManager;
