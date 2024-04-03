"use client";

import React, { useEffect, useState } from "react";
import PopUps from "./PopUps";

const PopUpsManager = ({ popUps }) => {
    const [shouldShowPopUps, setShouldShowPopUps] = useState([]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const currentDate = new Date().toDateString();
            const doNotShowAgainToday = JSON.parse(
                localStorage.getItem("doNotShowAgainToday") || "{}"
            );

            // Cleanup logic: Remove any entries that are not for today
            Object.keys(doNotShowAgainToday).forEach((key) => {
                if (doNotShowAgainToday[key] !== currentDate) {
                    delete doNotShowAgainToday[key];
                }
            });

            localStorage.setItem(
                "doNotShowAgainToday",
                JSON.stringify(doNotShowAgainToday)
            );

            const eligiblePopUps = popUps.filter(
                (popUp) =>
                    // Check if the popup was opted out for today
                    doNotShowAgainToday[popUp.id] !== currentDate
            );

            setShouldShowPopUps(eligiblePopUps);
        }
    }, [popUps]);

    return shouldShowPopUps.length > 0 ? (
        <PopUps initialPopUps={shouldShowPopUps} />
    ) : null;
};

export default PopUpsManager;
