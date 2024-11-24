"use client";

import {
  formatDate,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useEffect, useState } from "react";
import { getFieldFromCookie } from "@/app/utils/auth";

function Calender() {
  const [currentEvent, setCurrentEvent] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [selectDate, setSelectDate] = useState(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = getFieldFromCookie("userId");
      setUserId(userId);
      try {
        const response = await fetch(
          `/api/events/${userId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const contentType =
            response.headers.get("Content-Type");
          if (
            contentType &&
            contentType.includes("application/json")
          ) {
            const result = await response.json();

            setCurrentEvent(result);
          }
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchUserData();
  }, []);

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

  const handleAddEvent = async (e) => {
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
        userId: `${userId}`,
      };
      try {
        // POST the newEvent to the server
        const response = await fetch("/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newEvent),
        });

        if (response.ok) {
          // Optionally process the server's response
          const result = await response.json();
          console.log("Event successfully added:", result);

          // Add the event to the calendar locally
          calendarApi.addEvent(newEvent);

          // Close the dialog or reset state
          handleCloseDialog();
        } else {
          console.error(
            "Failed to add event:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error adding event:", error);
      }
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
        <DialogContent aria-describedby={undefined}>
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
