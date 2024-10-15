'use client';

import React, { useEffect, useState } from "react";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";

interface CalendarProps {
    data: Event[];  // You can specify the type if you know the structure of your data
  }

// Event object containing information for an event, stored in tags of it
type Event = {
    day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"
    startTime: string
    endTime: string
    unit: string
    lecturer: string
    deliveryMode: "Virtual" | "In-Person"
    classroom: string
    course: string
}


/* Converts an object from the Event type to DayPilot.EventData type
 * 
 * event - The Event object to be converted
 * 
 * Returns a Daypilot.EventData object with a copy of the event object stored in its tags
*/
function eventToDaypilotEvent(event: Event): DayPilot.EventData {
    return {
        tags: {
            event,
        }, 
        id: 0,
        text: "",
        start: timeToDaypilotTime(event.startTime, event.day),  
        end: timeToDaypilotTime(event.endTime, event.day),  
        // default color
        backColor: "#3d85c6"

    }
}

/* Converts a string of the form "8:00am" into a string of the form hh:mm:ss
 * in 24 hour time
 *
 * time - String to be converted
 * 
 * Returns a string in the hh:mm:ss format
*/
function timeToDaypilotTime(time: string, day: string): string {
    const dayToDateMap: {[key: string] : string} = {
        "Monday": "2024-09-29T",
        "Tuesday": "2024-09-30T",
        "Wednesday": "2024-10-01T",
        "Thursday": "2024-10-02T",
        "Friday": "2024-10-03T",
        "Saturday": "2024-10-04T",
        "Sunday": "2024-10-05T",
    }

    return `${dayToDateMap[day]}${time}:00`
}

function daypilotTimeToTime(daypilotTime: string): { time: string, day: string } {
    const dateToDayMap: { [key: string]: string } = {
        "2024-09-29": "Monday",
        "2024-09-30": "Tuesday",
        "2024-10-01": "Wednesday",
        "2024-10-02": "Thursday",
        "2024-10-03": "Friday",
        "2024-10-04": "Saturday",
        "2024-10-05": "Sunday",
    };

    // Extract the date part (first 10 characters: YYYY-MM-DD)
    var date = daypilotTime.substring(0, 10);

    // Extract the time part (characters from index 11 to 16: HH:MM)
    var time = daypilotTime.substring(11, 16);

    var day = dateToDayMap[date];

    return { time, day };
}

function getCalendarEvents(events: DayPilot.EventData[]): Event[] {
    return events.map(e => e.tags.event);
}

export default function Calendar( {data}: CalendarProps) {   
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

    const deliveryMode = [
        {name: "Virtual", id: "Virtual"},
        {name: "In Person", id: "In-Person"}
    ];

    // create useState hook
    const [calendar, setCalendar] = useState<DayPilot.Calendar>();

    // form created when trying to edit an event
    const editEvent = async (e: DayPilot.Event) => {
        // each line corresponds to a form entry line
        const form = [
            {name: "Unit", id: "unit", type: "text"},
            {name: "Start Time", id: "startTime", timeInterval: 15, type: "time"},
            {name: "End Time", id: "endTime", timeInterval: 15, type: "time"},
            {name: "Lecturer", id: "lecturer", type: "text"},
            {name: "Delivery Mode", id: "deliveryMode", type: "select", options: deliveryMode},
            {name: "Classroom", id: "classroom", type: "text"},
        ];

        // update information based on form
        var modal = await DayPilot.Modal.form(form, e.data.tags.event);
        if (modal.canceled) { return; }
        e.data.tags.event.unit = modal.result.unit;
        e.data.tags.event.startTime = modal.result.startTime;
        e.data.start = timeToDaypilotTime(modal.result.startTime, e.data.tags.event.day);
        e.data.tags.event.endTime = modal.result.endTime;
        e.data.end = timeToDaypilotTime(modal.result.endTime, e.data.tags.event.day);
        e.data.tags.event.lecturer = modal.result.lecturer;
        e.data.tags.event.deliveryMode = modal.result.deliveryMode;
        e.data.tags.event.classroom = modal.result.classroom;
        calendar?.events.update(e);
        

        // extracts all the event data from the calendar and prints to console
        console.log(calendar?.events.list.map(e => e.tags.event))
    };

    // form created to change event colour
    const changeColour = async (e: DayPilot.Event) => {
        const form = [
            {name: "Color", id: "backColor", type: "select", options: colors}
        ];
        var modal = await DayPilot.Modal.form(form, e.data);
        if (modal.canceled) { return; }
        e.data.backColor = modal.result.backColor;
        calendar?.events.update(e);

    }

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
                text: "Edit event",
                onClick: async args => {
                    await editEvent(args.source);
                }
            },
            {
                text: "Change colour",
                onClick: async args => {
                    await changeColour(args.source);
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
            <h1 style="font-size: 16px; text-decoration: underline;"> ${args.data.tags.event.unit} </h1>
            <p> ${args.data.tags.event.startTime} to ${args.data.tags.event.endTime}</p>
            <p> ${args.data.tags.event.lecturer}</p>
            <p> ${args.data.tags.event.deliveryMode}: ${args.data.tags.event.classroom}</p>
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
        data
        const events: DayPilot.EventData[] = data.map(e => eventToDaypilotEvent(e));

        const startDate = "2024-10-01";

        calendar.update({startDate,     events});

        // update tag information when an event is moved
        calendar.onEventMoved = (args) => {
            console.log("Moved: " + args.e.text());
            args.e.data.tags.event.startTime = daypilotTimeToTime(args.e.data.start);
            args.e.data.tags.event.endTime = daypilotTimeToTime(args.e.data.end);
          };

    }, [calendar]);

    // when selecting a time range, creat new event (maybe remove)
    const onTimeRangeSelected = async (args: DayPilot.CalendarTimeRangeSelectedArgs) => {
        const modal = await DayPilot.Modal.prompt("Create a new event:", "New Class");
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
