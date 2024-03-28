/* eslint-disable no-alert */

"use client";

import moment, { Moment } from "moment";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useBookingModal } from "./BookingModal";
import { getAvailableTimes } from "../../app/booking/actions";

export default function CustomerCalendar({ service, designer }) {
    const current = moment();

    // formatting function
    const createWeekOnMid = (midDay: Moment) => {
        const week = [
            moment(midDay).subtract(3, "days").startOf("day"),
            moment(midDay).subtract(2, "days").startOf("day"),
            moment(midDay).subtract(1, "days").startOf("day"),
            midDay.startOf("day"),
            moment(midDay).add(1, "days").startOf("day"),
            moment(midDay).add(2, "days").startOf("day"),
            moment(midDay).add(3, "days").startOf("day")
        ];

        return week;
    };

    // stateful variables
    const [selectedDate, setSelectedDate] = useState<null | Moment>(null);
    const [selectedTime, setSelectedTime] = useState<null | string>(null);

    const [targetWeek, setTargetWeek] = useState(createWeekOnMid(current));
    const [availableTimes, setAvailableTimes] = useState<null | object>(null);

    // reset all selected date and selected time once either service is changed
    useEffect(() => {
        setSelectedDate(null);
        setSelectedTime(null);
        setAvailableTimes(null);
    }, [service]);

    // reset all selected date and selected time once staff is changed
    useEffect(() => {
        setSelectedDate(null);
        setSelectedTime(null);
        setAvailableTimes(null);
    }, [designer]);

    // check if updated service is available between start date and end date
    // then update available time
    useEffect(() => {
        if (!selectedDate) {
            return;
        }

        if (!service) {
            alert("please select service please");
            setSelectedDate(null);
            return;
        }

        if (!designer) {
            alert("please select designer please");
            setSelectedDate(null);
            return;
        }

        if (
            !selectedDate.isBetween(
                moment(service.startDate),
                moment(service.endDate ?? new Date(8640000000000000)),
                null,
                "[)"
            )
        ) {
            setSelectedDate(null);
            setSelectedTime(null);
            setAvailableTimes(null);
            alert("Service is not available on the date");
            return;
        }

        getAvailableTimes(service, designer, selectedDate.toDate()).then(
            (res) => {
                setAvailableTimes(res);
            }
        );
    }, [designer, selectedDate, service]);

    // button functions
    const clickArrow = (isRight: boolean) => {
        const currentMidDay = targetWeek[3];
        if (isRight) {
            currentMidDay.add(1, "week");
        } else {
            currentMidDay.subtract(1, "week");
        }

        setSelectedDate(null);
        setSelectedTime(null);

        const weekOnMid = createWeekOnMid(currentMidDay);
        setTargetWeek(weekOnMid);
    };

    const { DemoModal, setShowDemoModal } = useBookingModal(
        service,
        designer,
        selectedDate?.format("MM DD") ?? "",
        selectedTime!
    );

    return (
        <>
            <div className="rounded-md p-6">
                <div className="mx-auto mb-5 rounded-lg shadow-md md:mx-12">
                    <div className="pt-1 text-center font-bold">
                        {targetWeek[3].format("MMMM")}
                    </div>
                    <div className="flex justify-start px-2 py-4 md:justify-center">
                        <button
                            className="mr-5"
                            aria-label="Save"
                            onClick={() => clickArrow(false)}
                        >
                            <ArrowLeftIcon />
                        </button>
                        {targetWeek.map((d) => (
                            <button
                                onClick={() => {
                                    setSelectedDate(d);
                                }}
                                key={d.format("mmdd")}
                                className={`group mx-1 flex w-16 cursor-pointer justify-center rounded-full ${selectedDate?.format("MMDD") === d.format("MMDD") ? "bg-blue-400" : "hover-dark-shadow transition-all duration-300 hover:bg-blue-300 hover:shadow-lg "}`}
                            >
                                <div className="flex items-center px-4 py-4">
                                    <div className="text-center">
                                        <p
                                            className={`text-sm transition-all duration-300  ${
                                                moment().format("MMDD") ===
                                                d.format("MMDD")
                                                    ? "font-bold"
                                                    : ""
                                            } `}
                                        >
                                            {d.format("ddd")}{" "}
                                        </p>
                                        <p
                                            className={`group-hover:text-gray-100" mt-3 transition-all duration-300	group-hover:font-bold ${
                                                moment().format("MMDD") ===
                                                d.format("MMDD")
                                                    ? "font-bold"
                                                    : ""
                                            }`}
                                        >
                                            {" "}
                                            {d.date()}{" "}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))}
                        <button
                            className="ml-5"
                            aria-label="Save"
                            onClick={() => clickArrow(true)}
                        >
                            <ArrowRightIcon />
                        </button>
                    </div>
                </div>
                <div className="mx-auto rounded-lg px-2 py-4 text-center shadow-md md:mx-12 md:justify-center">
                    <h3>Time</h3>
                    <div className="mt-3 align-middle">
                        {availableTimes
                            ? Object.entries(availableTimes).map(
                                  ([time, available]) => (
                                      <button
                                          key={time}
                                          onClick={() => {
                                              setSelectedTime(time);
                                          }}
                                          disabled={!available}
                                          type="button"
                                          className={`m-auto mt-1.5 block w-96 rounded-md border-2 border-x-blue-100 dark:border-white dark:bg-black ${time === selectedTime ? "bg-blue-200 dark:bg-blue-300" : "bg-blue-50 hover:bg-blue-100 dark:hover:bg-blue-200"} ${available ? "" : "!bg-gray-50 dark:!bg-gray-500"}`}
                                      >
                                          {time}
                                      </button>
                                  )
                              )
                            : "Please select date first"}
                    </div>

                    <button
                        type="button"
                        className="m-auto mt-10 block w-96 rounded-md border-2 border-x-blue-100 bg-blue-200 dark:border-white dark:bg-black"
                        onClick={() => {
                            if (
                                !selectedDate ||
                                !selectedTime ||
                                !service ||
                                !designer
                            ) {
                                alert("Please enter all required fields");
                                return;
                            }
                            setShowDemoModal(true);
                        }}
                    >
                        Book Now
                    </button>
                    <DemoModal></DemoModal>
                </div>
            </div>
        </>
    );
}
