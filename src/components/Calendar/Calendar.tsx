import moment from "moment";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import { myEvents } from "../../res/myEvents";
import { useEffect, useState } from "react";

const localizer = momentLocalizer(moment);

export const MyCalendar = () => {
  const [view, setView] = useState<(typeof Views)[keyof typeof Views]>(
    Views.MONTH
  );
  const [date, setDate] = useState(new Date());
  const fakeAllDayEvent = {
    title: "Event name",
    allDay: true,
    start: new Date(), // Сьогоднішній день
    end: new Date(),
    isFake: true, // Позначаємо подію як фейкову
  };

  const secondFakeAllDayEvent = {
    title: "Event name",
    allDay: true,
    start: new Date(), // Сьогоднішній день
    end: new Date(),
    isFake: true, // Позначаємо подію як фейкову
  };

  const events = [
    ...myEvents,
    fakeAllDayEvent,
    secondFakeAllDayEvent,
    secondFakeAllDayEvent,
  ];

  useEffect(() => {
    const allDayCell = document.getElementsByClassName(
      "rbc-time-header-gutter"
    );

    if (allDayCell.length > 0) {
      allDayCell[0].textContent = "all day";
    }
  });

  return (
    <>
      <div className="calendar-wrapper myCustomHeight">
        <h3 className="rdc_calendar-title">Calendar View</h3>

        <Calendar
          localizer={localizer}
          events={events}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          defaultView={view}
          view={view}
          date={date}
          step={120}
          timeslots={1}
          onView={(view) => setView(view)}
          onNavigate={(date) => {
            setDate(new Date(date));
          }}
        />
      </div>
    </>
  );
};
