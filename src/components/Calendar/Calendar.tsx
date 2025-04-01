import moment from "moment";
import { Calendar, momentLocalizer, SlotInfo, Views } from "react-big-calendar";
import { myEvents } from "../../res/myEvents";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { ModalOfEvents } from "../ModalOfEvents";
import { MyEvent, EventAction } from "../../types";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop<MyEvent>(Calendar);

export const MyCalendar = () => {
  const [view, setView] = useState<(typeof Views)[keyof typeof Views]>(
    Views.MONTH
  );
  const [eventsState, setEventsState] = useState<MyEvent[]>(() => {
    const savedEvents = JSON.parse(localStorage.getItem("events") || "[]");

    return savedEvents.length > 0
      ? savedEvents.map((event: MyEvent) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }))
      : myEvents;
  });

  const [date, setDate] = useState(new Date());
  const [isModal, setIsModal] = useState(false);
  const [eventSlot, setEventSlot] = useState<SlotInfo | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<null | MyEvent>(null);
  const [click, setClick] = useState<null | MouseEvent>(null);

  const eventPropGetter = (event: MyEvent) => {
    return {
      className: event.eventColor !== "default" ? event.eventColor : "",
    };
  };

  const onNavigate = useCallback(
    (newDate: Date) => setDate(newDate),
    [setDate]
  );

  const onView = useCallback(
    (newView: (typeof Views)[keyof typeof Views]) => setView(newView),
    [setView]
  );

  const onEventDrop = ({ event, start, end }: EventAction) => {
    const updatedEvents = eventsState.map((e) =>
      e.id === event.id
        ? { ...e, start: new Date(start), end: new Date(end) }
        : e
    );
    setEventsState(updatedEvents);
  };

  const onEventResize = ({ event, start, end }: EventAction) => {
    const updatedEvents = eventsState.map((e) =>
      e.id === event.id
        ? { ...e, start: new Date(start), end: new Date(end) }
        : e
    );
    setEventsState(updatedEvents);
  };

  useLayoutEffect(() => {
    const mouseClick = (event: MouseEvent) => {
      if (!isModal) {
        setClick(event);
      }
    };

    const escClose = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isModal) {
          setIsModal(false);
          setSelectedEvent(null);
          setEventSlot(null);
          setClick(null);
        }
      }
    };

    document.addEventListener("dblclick", mouseClick);
    document.addEventListener("keydown", escClose);

    return () => {
      document.removeEventListener("dblclick", mouseClick);
      document.removeEventListener("keydown", escClose);
    };
  }, [isModal]);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(eventsState));
  }, [eventsState]);

  useEffect(() => {
    const allDayCell = document.getElementsByClassName(
      "rbc-time-header-gutter"
    );

    if (view === Views.DAY) {
      setTimeout(() => {
        const indicator = document.getElementsByClassName(
          "rbc-current-time-indicator"
        )[0];

        indicator.classList.add("indicator-day");
      }, 0);
    }

    if (allDayCell.length > 0) {
      allDayCell[0].textContent = "all day";
    }

    if (view === Views.WEEK) {
      setTimeout(() => {
        const indicatorArray = document.getElementsByClassName(
          "rbc-current-time-indicator"
        );

        if (indicatorArray.length > 0) {
          const indicator = indicatorArray[0];
          const weekContent =
            document.getElementsByClassName("rbc-time-content")[0];

          indicator.classList.add("my-custom-indicator");

          weekContent.appendChild(indicator);
        }
      }, 0);
    }
  }, [view, date, isModal]);

  return (
    <>
      <div className="calendar-wrapper myCustomHeight">
        <h3 className="rdc_calendar-title">Calendar View</h3>

        <DnDCalendar
          localizer={localizer}
          events={eventsState}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          defaultView={view}
          view={view}
          date={date}
          step={120}
          timeslots={1}
          popup
          onView={onView}
          onNavigate={onNavigate}
          selectable
          onSelectSlot={(slot) => {
            setSelectedEvent(null);
            setEventSlot(null);

            setEventSlot(slot);
            setIsModal(true);
          }}
          onDoubleClickEvent={(event) => {
            setSelectedEvent(null);
            setEventSlot(null);
            setIsModal(false);

            setSelectedEvent(event as MyEvent);
            setTimeout(() => setIsModal(true), 0);
          }}
          onEventDrop={onEventDrop}
          onEventResize={onEventResize}
          resizable
          eventPropGetter={eventPropGetter}
        />

        {isModal && (
          <ModalOfEvents
            top={eventSlot?.box?.y}
            left={eventSlot?.box?.x}
            handleEventsState={setEventsState}
            handleIsModal={setIsModal}
            eventSlot={eventSlot}
            selectedEvent={selectedEvent}
            handleSelectedEvent={setSelectedEvent}
            eventsState={eventsState}
            handleEventSlot={setEventSlot}
            click={click}
          />
        )}
      </div>
    </>
  );
};
