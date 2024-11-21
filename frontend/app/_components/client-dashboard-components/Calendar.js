"use client";

import {
  formatDate,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useEffect, useState } from "react";

function Calender() {
  const [currentEvent, setCurrentEvent] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [selectDate, setSelectDate] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEvent = localStorage.getItem("event");
      if (savedEvent) {
        setCurrentEvent(JSON.parse(savedEvent));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "event",
        JSON.stringify(currentEvent)
      );
    }
  }, [currentEvent]);

  const HandleDateClick = (selected) => {
    console.log("Date selected:", selected);
    setSelectDate(selected);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewEventTitle("");
  };

  const handleEventClick = (selected) => {
    if (
      window.confirm(
        "Are you sure you want to delete this event?"
      )
    ) {
      selected.event.remove();
    }
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (newEventTitle && selectDate) {
      const calendarApi = selectDate.view.calendar;
      calendarApi.unselect();

      const newEvent = {
        id: `${selectDate.start.toISOString()}-${newEventTitle}`,
        title: newEventTitle,
        start: selectDate.start,
        end: selectDate.end,
        allDay: selectDate.allDay,
      };

      calendarApi.addEvent(newEvent);
      handleCloseDialog();
    }
  };

  return (
    <>
      <div className="flex w-full px-10 justify-start items-start gap-8">
        <div className="w-3/12">
          <div className="py-10 text-2xl font-extrabold px-7">
            Calendar Event
          </div>
          <ul className="space-y-4">
            {currentEvent.length <= 0 && (
              <div className="italic text-center text-gray-400">
                No Events
              </div>
            )}

            {currentEvent.length > 0 &&
              currentEvent.map((event) => (
                <li
                  className="border border-gray-200 shadow px-4 py-2 rounded-md text-primary-600"
                  key={event.id}
                >
                  {event.title} -{" "}
                  <label className="text-primary-950">
                    {formatDate(event.start, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </label>
                </li>
              ))}
          </ul>
        </div>
        <div className="w-9/12 mt-8">
          <FullCalendar
            height={"60vh"}
            plugins={[dayGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,dayGridWeek,dayGridDay",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={HandleDateClick}
            eventClick={handleEventClick}
            eventsSet={(events) =>
              setCurrentEvent(
                events.map((event) => event.toPlainObject())
              )
            }
            initialEvents={
              typeof window !== "undefined"
                ? JSON.parse(
                    localStorage.getItem("events") || "[]"
                  )
                : []
            }
          />
        </div>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Event</DialogTitle>
          </DialogHeader>
          <form
            className="space-x-5 mb-4"
            onSubmit={handleAddEvent}
          >
            <input
              type="text"
              placeholder="Event Title"
              value={newEventTitle}
              onChange={(e) =>
                setNewEventTitle(e.target.value)
              }
              required
              className="border border-gray-200 p-3 rounded-md text-lg"
            />
            <button
              className="bg-accent-300 text-white p-3 mt-5 rounded-md"
              type="submit"
            >
              Add
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Calender;
