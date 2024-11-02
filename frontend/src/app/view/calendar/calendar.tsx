'use client';

import React, { useEffect, useState } from "react";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";

interface CalendarProps {
    data: Event[];  // You can specify the type if you know the structure of your data
}

type DayWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"

// Event object containing information for an event, stored in tags of it
type Event = {
    day: DayWeek
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


/* Converts a DayPilot.Date object into an array of strings corresponding to
 * date and time
 *
 * daypilotTime - Date object to be converted
 * 
 * Returns an array of strings with the 0 index being the day and 1 indec the
 * time
*/
function daypilotTimeToTime(daypilotTime: DayPilot.Date): {day: DayWeek, time: string} {
    const dateToDayMap: { [key: string]: DayWeek } = {
        "2024-09-29": "Monday",
        "2024-09-30": "Tuesday",
        "2024-10-01": "Wednesday",
        "2024-10-02": "Thursday",
        "2024-10-03": "Friday",
        "2024-10-04": "Saturday",
        "2024-10-05": "Sunday",
    };

    let [day, time] = daypilotTime.toString().split("T")

    return { day: dateToDayMap[day], time: time.slice(0, 5) };
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

    const eventForm = [
        {name: "Unit", id: "unit", type: "text"},
        {name: "Start Time", id: "startTime", timeInterval: 15, type: "time"},
        {name: "End Time", id: "endTime", timeInterval: 15, type: "time"},
        {name: "Lecturer", id: "lecturer", type: "text"},
        {name: "Delivery Mode", id: "deliveryMode", type: "select", options: deliveryMode},
        {name: "Classroom", id: "classroom", type: "text"},
        {name: "Course", id: "course", type: "text"},
    ];

    // create useState hook
    const [calendar, setCalendar] = useState<DayPilot.Calendar>();

    // form created when trying to edit an event
    const editEvent = async (e: DayPilot.Event) => {
        // update information based on form
        var modal = await DayPilot.Modal.form(eventForm, e.data.tags.event);
        if (modal.canceled) { return; }

        e.data.tags.event = modal.result;
        e.data.start = timeToDaypilotTime(modal.result.startTime, modal.result.day);
        e.data.end = timeToDaypilotTime(modal.result.endTime, modal.result.day);

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

    const onBeforeHeaderRender = (args: DayPilot.CalendarBeforeHeaderRenderArgs) => {
        args.header.html = `
        <div>
            ${daypilotTimeToTime(args.column.start).day}
        <div/>`
    };

    // called whenever an event is moved
    const onEventMoved = (args: DayPilot.CalendarEventMovedArgs) => {
        args.e.data.tags.event.startTime = daypilotTimeToTime(args.newStart).time;
        args.e.data.tags.event.endTime = daypilotTimeToTime(args.newEnd).time;
        args.e.data.tags.event.day = daypilotTimeToTime(args.newStart).day;

        // updating html based on new data
        onBeforeEventRender({ data: args.e.data, control: args.control });
        calendar?.events.update(args.e);
    };

    // called whenever an event is resized
    const onEventResized = (args: DayPilot.CalendarEventResizedArgs) => {
        args.e.data.tags.event.startTime = daypilotTimeToTime(args.newStart).time;
        args.e.data.tags.event.endTime = daypilotTimeToTime(args.newEnd).time;
        args.e.data.tags.event.day = daypilotTimeToTime(args.newStart).day;

        // updating html based on new data
        onBeforeEventRender({ data: args.e.data, control: args.control });
        calendar?.events.update(args.e);
    };

    // configuration of calendar view
    const initialConfig: DayPilot.CalendarConfig = {
        viewType: "Week",
        durationBarVisible: false,
    };

    const [config, setConfig] = useState(initialConfig);

    useEffect(() => {

        if (!calendar || calendar?.disposed()) {
            return;
        }
        const events: DayPilot.EventData[] = data.map(e => eventToDaypilotEvent(e));

        const startDate = "2024-10-01";

        calendar.update({startDate, events});

        // update tag information when an event is moved

    }, [calendar]);

    // when selecting a time range, creat new event (maybe remove)
    const onTimeRangeSelected = async (args: DayPilot.CalendarTimeRangeSelectedArgs) => {
        let e: Event = {
            day: daypilotTimeToTime(args.start).day,
            startTime: daypilotTimeToTime(args.start).time,
            endTime: daypilotTimeToTime(args.end).time,
            unit: "",
            lecturer: "",
            deliveryMode: "In-Person",
            classroom: "",
            course: ""
        }

        var modal = await DayPilot.Modal.form(eventForm, e);
        if (modal.canceled) { return; }

        calendar?.events.add({
            start: timeToDaypilotTime(modal.result.startTime, modal.result.day),
            end: timeToDaypilotTime(modal.result.endTime, modal.result.day),
            id: DayPilot.guid(),
            text: modal.result,
            tags: {
                event: modal.result
            }
        });
    };

    return (
        <div>
            <DayPilotCalendar
                {...config}
                onTimeRangeSelected={onTimeRangeSelected}
                onEventMoved={onEventMoved}
                onEventResized={onEventResized}
                onEventClick={async args => { await editEvent(args.e); }}
                contextMenu={contextMenu}
                onBeforeEventRender={onBeforeEventRender}
                onBeforeHeaderRender={onBeforeHeaderRender}
                controlRef={setCalendar}
            />
        </div>
    );
}
