'use client';

import React, { useEffect, useState } from 'react';
import { DayPilot, DayPilotCalendar } from '@daypilot/daypilot-lite-react';
import axios from 'axios';
import data from './events.json';
import './calendar.css';

export default function Calendar() {
  const [calendar, setCalendar] = useState<DayPilot.Calendar>();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loading, setLoading] = useState(true);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:5000/check-auth');
        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          window.location.href = '/login'; // Redirect to login if not authenticated
        }
      } catch (error) {
        setIsAuthenticated(false);
        window.location.href = '/login'; // Redirect to login if there is an error
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <p>Loading...</p>; // Show loading state while checking authentication
  }

  if (!isAuthenticated) {
    return null; // Do not render anything if not authenticated
  }

  const styles = {
    wrap: {
      display: 'flex'
    },
    left: {
      marginRight: '10px'
    },
    main: {
      flexGrow: '1'
    }
  };

  const colors = [
    { name: 'Green', id: '#6aa84f' },
    { name: 'Blue', id: '#3d85c6' },
    { name: 'Turquoise', id: '#00aba9' },
    { name: 'Light Blue', id: '#56c5ff' },
    { name: 'Yellow', id: '#f1c232' },
    { name: 'Orange', id: '#e69138' },
    { name: 'Red', id: '#cc4125' },
    { name: 'Light Red', id: '#ff0000' },
    { name: 'Purple', id: '#af8ee5' }
  ];

  const editEvent = async (e: DayPilot.Event) => {
    const form = [
      { name: 'Event text', id: 'text', type: 'text' },
      { name: 'Event color', id: 'backColor', type: 'select', options: colors }
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
        text: 'Delete',
        onClick: async args => {
          calendar?.events.remove(args.source);
        }
      },
      {
        text: '-'
      },
      {
        text: 'Edit...',
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
        symbol: 'icons/daypilot.svg#minichevron-down-2',
        fontColor: '#fff',
        backColor: '#00000033',
        style: 'border-radius: 25%; cursor: pointer;',
        toolTip: 'Show context menu',
        action: 'ContextMenu'
      }
    ];
  };

  const initialConfig: DayPilot.CalendarConfig = {
    viewType: 'Week',
    durationBarVisible: false
  };

  const [config, setConfig] = useState(initialConfig);

  useEffect(() => {
    if (!calendar || calendar?.disposed()) {
      return;
    }
    const events: DayPilot.EventData[] = data;

    const startDate = '2024-10-01';

    calendar.update({ startDate, events });
  }, [calendar]);

  const onTimeRangeSelected = async (args: DayPilot.CalendarTimeRangeSelectedArgs) => {
    const modal = await DayPilot.Modal.prompt('Create a new event:', 'Event 1');
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
        participants: 1
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
