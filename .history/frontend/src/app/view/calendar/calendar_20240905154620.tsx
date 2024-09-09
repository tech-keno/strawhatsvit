'use client';

import React, { useEffect, useState } from "react";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import data from "./events.json";

export default function Calendar() {
    const [authenticated, setAuthenticated] = useState(false);
    const [calendar, setCalendar] = useState<DayPilot.Calendar>();
    const [config, setConfig] = useState<DayPilot.CalendarConfig>({
        viewType: "Week",
        durationBarVisible: false,
    });

    useEffect(() => {
        async function checkAuth() {
            const response = await fetch('/check-auth');
            if (response.ok) {
                setAuthenticated(true);
            } else {
                setAuthenticated(false);
                window.location.href = "/login";  // Redirect to login page
            }
        }
        checkAuth();
    }, []);

    const editEvent = async (e: DayPilot.Event) => {
        const form = [
            { name: "Event text", id: "text", type: "text" },
            { name: "Event color", id: "backColor", type: "select", options: colors },
        ];

        const modal = await DayPilot.Modal.form(form, e.data);
        if (modal.canceled) { return; }
        e.data.text = modal.result.text;
        e.data.backColor = modal.result.backColor;
        calendar?.events.update(e);
    };

    const contextMenu = new DayPilot.Menu({
        items: [
            {
                text: "Delete",
                onClick: async args => {
                    calendar?.events.remove(args.source);
                },
            },
            {
                text: "-"
            },
            {
                text: "Edit...",
                onClick: async args => {
                    await editEvent(args.source);
                }
            }
        ]
    });

    const onBeforeEventRender = (args: DayPilot.CalendarBeforeEventRenderArgs) => {
        args.data.areas = [
            {
                top: 5,
                right: 5,
                width: 20,
                height: 20,
                symbol: "icons/daypilot.svg#minichevron-down-2",
                fontColor: "#fff",
                backColor: "#00000033",
                style: "border-radius: 25%; cursor: pointer;",
                toolTip: "Show context menu",
                action: "ContextMenu",
            },
        ];
    };

    useEffect(() => {
        if (!calendar || calendar?.disposed()) {
            return;
        }
        const events: DayPilot.EventData[] = data;

        const startDate = "2024-10-01";

        calendar.update({ startDate, events });
    }, [calendar]);

    const onTimeRangeSelected = async (args: DayPilot.CalendarTimeRangeSelectedArgs) => {
        const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
        calendar?.clearSelection();
        if (modal.canceled) {
            return;
        }
        calendar?.events.add({
            start: args.start,
            end: args.end,
            id: DayPilot.guid(),
            text: modal.result,
            tags: {
                participants: 1,
            }
        });
    };

    if (!authenticated) {
        return <div>Loading...</div>;  // or a login redirect component
    }

    return (
        <div>
            <DayPilotCalendar
                {...config}
                onTimeRangeSelected={onTimeRangeSelected}
                onEventClick={async args => { await editEvent(args.e); }}
                contextMenu={contextMenu}
                onBeforeEventRender={onBeforeEventRender}
                controlRef={setCalendar}
            />
        </div>
    );
}
