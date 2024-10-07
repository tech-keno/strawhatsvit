'use client';

import React, { useEffect, useState } from "react";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";

type Event = {
    day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"
    time: string
    unit: string
    lecturer: string
    deliveryMode: "online" | "in-person"
    classroom: string
}

const eventData: Event[] = [
    {
        day: "monday",
        time: "8:00am to 10:00am",
        unit: "aaaaaaaaaaaaaaa",
        lecturer: "me",
        deliveryMode: "in-person",
        classroom: "13"
    }
] 

/* Converts an object from the Event type to DayPilot.EventData type
 * 
 * event - The Event object to be converted
 * 
 * Returns a Daypilot.EventData object with a copy of the event object stored in its tags
*/
function eventToDaypilotEvent(event: Event): DayPilot.EventData {
    const dayToDateMap: {[key: string] : string} = {
        "monday": "2024-09-29T",
        "tuesday": "2024-09-30T",
        "wednesday": "2024-10-01T",
        "thursday": "2024-10-02T",
        "friday": "2024-10-03T",
        "saturday": "2024-10-04T",
        "sunday": "2024-10-05T"
    }

    const times = event.time.split(" ");
    return {
        tags: {event},
        id: 0,
        text: "",
        start: `${dayToDateMap[event.day]}${timeToDaypilotTime(times[0])}`,
        end: `${dayToDateMap[event.day]}${timeToDaypilotTime(times[2])}`
    }
}

/* Converts a string of the form "8:00am" into a string of the form hh:mm:ss
 * in 24 hour time
 *
 * time - String to be converted
 * 
 * Returns a string in the hh:mm:ss format
*/
function timeToDaypilotTime(time: string): string {
    let [timePart, modifier] = time.match(/(\d{1,2}:\d{2})(am|pm)/i)?.slice(1) || [];

    let [hours, minutes] = timePart.split(":").map(Number);

    if (modifier === "pm" && hours < 12) {
        hours += 12;
    } else if (modifier === "am" && hours === 12) {
        hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;
}

/* Converts a string of the form hh:mm:ss into a string of the form "8:00"am
 *
 * time - String to be converted
 * 
 * Returns a string in the hh:mm:ss format
*/
function daypilotTimeToTime(date: DayPilot.Date): string {
    let [hours, minutes] = date.toString().match(/(\d{2}:)/)?.slice(1).map(Number) || [];

    let modifier = 'am';

    if (hours >= 12) {
        modifier = 'pm';
        if (hours > 12) {
            hours -= 12;
        }
    } else if (hours === 0) {
        hours = 12;
    }

    return `${hours.toString()}:${minutes.toString().padStart(2, '0')}${modifier}`
}

function getCalendarEvents(events: DayPilot.EventData[]): Event[] {
    return events.map(e => e.tags.event);
}

export default function Calendar() {   

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

    // create useState hook
    const [calendar, setCalendar] = useState<DayPilot.Calendar>();

    // form created when trying to edit an event
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

        // extracts all the event data from the calendar and prints to console
        console.log(calendar?.events.list.map(e => e.tags.event))
    };

    // menu that pops up when clicking the little square on the top right of events
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

    // stuff done to events before rendering
    const onBeforeEventRender = (args: DayPilot.CalendarBeforeEventRenderArgs) => {
        args.data.areas = [
            {
                top: 5,
                right: 5,
                width: 20,
                height: 20,
                fontColor: "#fff",
                backColor: "#00000033",
                style: "border-radius: 25%; cursor: pointer;",
                toolTip: "Show context menu",
                action: "ContextMenu",
            },
        ];
        args.data.html = `
        <div>
          ${args.data.tags.event.unit}
        <div/>`
    };

    // configuration of calendar view
    const initialConfig: DayPilot.CalendarConfig = {
        viewType: "Week",
        durationBarVisible: false,
    };

    const [config, setConfig] = useState(initialConfig);

    // use effect hook manages changing 
    useEffect(() => {
        // const fetchDocuments = async () => {
        //     try {
        //         const response = await fetch('http://localhost:5000/get_classes', {
        //             method: 'GET',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //             },
        //         });
        //         if (response.ok) {
        //             const documents = await response.json();
        //             console.log(documents);
        //         } else {
        //             console.error("Failed to fetch documents");
        //         }
        //     } catch (error) {
        //         console.error("Error fetching documents:", error);
        //     }
        // };
        
        // fetchDocuments();

        if (!calendar || calendar?.disposed()) {
            return;
        }
        const events: DayPilot.EventData[] = eventData.map(e => eventToDaypilotEvent(e));

        const startDate = "2024-10-01";

        calendar.update({startDate, events});

        calendar.onEventMoved = (args) => {
            console.log("Moved: " + args.e.text());
          };

    }, [calendar]);

    // when selecting a time range, creat new event (maybe remove)
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
