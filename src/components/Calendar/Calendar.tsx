import moment from "moment";
import { Calendar, momentLocalizer, SlotInfo, Views } from "react-big-calendar";
import { myEvents } from "../../res/myEvents";
import { useCallback, useEffect, useState } from "react";
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
  const [eventsState, setEventsState] = useState<MyEvent[]>(myEvents);
  const [date, setDate] = useState(new Date());
  const [isModal, setIsModal] = useState(false);
  const [eventSlot, setEventSlot] = useState<SlotInfo | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<null | MyEvent>(null);
  const [click, setClick] = useState<null | MouseEvent>(null);

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
  
  useEffect(() => {
    const mouseClick = (event: MouseEvent) => {
      setClick(event);
    };

    document.addEventListener("click", mouseClick);

    const allDayCell = document.getElementsByClassName(
      "rbc-time-header-gutter"
    );

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

    return () => {
      document.removeEventListener("click", mouseClick);
    };
  }, [view, date]);

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
            setIsModal(true);
            setEventSlot(slot);
          }}
          onSelectEvent={(event) => {
            console.log(event);
          }}
          onDoubleClickEvent={(event) => {
            setSelectedEvent(event as MyEvent);
            setIsModal(true);
          }}
          onEventDrop={onEventDrop}
          onEventResize={onEventResize}
          resizable
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
