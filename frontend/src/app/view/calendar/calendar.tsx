'use client';

import React, {useEffect, useState} from "react";
import {DayPilot, DayPilotCalendar} from "@daypilot/daypilot-lite-react";

export default function Calendar() {

    const styles = {
        wrap: {
            display: "flex"
        },
        left: {
            marginRight: "10px"
        },
        main: {
            flexGrow: "1"
        }
    };

    const colors = [
        {name: "Green", id: "#6aa84f"},
        {name: "Blue", id: "#3d85c6"},
        {name: "Turquoise", id: "#00aba9"},
        {name: "Light Blue", id: "#56c5ff"},
        {name: "Yellow", id: "#f1c232"},
        {name: "Orange", id: "#e69138"},
        {name: "Red", id: "#cc4125"},
        {name: "Light Red", id: "#ff0000"},
        {name: "Purple", id: "#af8ee5"},
    ];


    const [calendar, setCalendar] = useState<DayPilot.Calendar>();

    const editEvent = async (e: DayPilot.Event) => {
        const form = [
            {name: "Event text", id: "text", type: "text"},
            {name: "Event color", id: "backColor", type: "select", options: colors},
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

    const initialConfig: DayPilot.CalendarConfig = {
        viewType: "Week",
        durationBarVisible: false,
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
            },
            {
                id: 2,
                text: "Event 2",
                start: "2024-10-03T09:30:00",
                end: "2024-10-03T11:30:00",
                backColor: "#6aa84f",
            },
            {
                id: 3,
                text: "Event 3",
                start: "2024-10-03T12:00:00",
                end: "2024-10-03T15:00:00",
                backColor: "#f1c232",
            },
            {
                id: 4,
                text: "Event 4",
                start: "2024-10-01T11:30:00",
                end: "2024-10-01T14:30:00",
                backColor: "#cc4125",
            },
        ];

        const startDate = "2024-10-01";

        calendar.update({startDate, events});
    }, [calendar]);

    const onTimeRangeSelected = async (args: DayPilot.CalendarTimeRangeSelectedArgs) => {
        const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
        calendar?.clearSelection();
        if (modal.canceled) {
            return;
        }
        // console.log("modal.result", modal.result, calendar);
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
    )
}