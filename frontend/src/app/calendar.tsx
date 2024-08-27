'use client';

import React, {useEffect, useState} from "react";
import {DayPilot, DayPilotCalendar} from "@daypilot/daypilot-lite-react";

export default function Calendar() {

    const [calendar, setCalendar] = useState<DayPilot.Calendar>();

    const initialConfig: DayPilot.CalendarConfig = {
        viewType: "Week",
        startDate: "2024-10-01",
        locale: "en-us"
    };

    const [config, setConfig] = useState(initialConfig);

    useEffect(() => {

        if (!calendar || calendar?.disposed()) {
            return;
        }
        const events: DayPilot.EventData[] = [
            {
                id: 1,
                text: "Event 1",
                start: "2024-10-02T10:30:00",
                end: "2024-10-02T13:00:00",
                tags: {
                    participants: 2,
                }
            },
            
            
        ];

        calendar.update({events});
    }, [calendar]);


    return (
        <div>
            <DayPilotCalendar
                {...config}
                controlRef={setCalendar}
            />
        </div>
    )
}