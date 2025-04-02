import React, { useEffect, useState } from "react";
import { SlotInfo } from "react-big-calendar";
import { FieldValues, useForm, Controller } from "react-hook-form";
import moment from "moment";
import { MyEvent } from "../../types";
import { convertDate, isEventAllDay, isEventMoreThanOneDay } from "../../utils";
import { DateStyle } from "../../types/enums";

interface Props {
  top: number | undefined;
  left: number | undefined;
  handleEventsState: React.Dispatch<React.SetStateAction<MyEvent[]>>;
  handleIsModal: React.Dispatch<React.SetStateAction<boolean>>;
  eventSlot: SlotInfo | null;
  selectedEvent: MyEvent | null;
  handleSelectedEvent: React.Dispatch<React.SetStateAction<MyEvent | null>>;
  eventsState: MyEvent[];
  handleEventSlot: React.Dispatch<React.SetStateAction<SlotInfo | null>>;
  click: MouseEvent | null;
}

export const ModalOfEvents: React.FC<Props> = ({
  top,
  left,
  handleEventsState,
  handleIsModal,
  eventSlot,
  selectedEvent,
  handleSelectedEvent,
  eventsState,
  handleEventSlot,
  click,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();
  const [isAllDay, setIsAllDay] = useState(false);
  const [moreThanOneDay, setMoreThanOneDay] = useState(false);

  const handleDeletingEvent = () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      const newEvents = eventsState.filter(
        (event) => event.id !== selectedEvent?.id
      );

      handleEventsState(newEvents);
      handleIsModal(false);
      handleSelectedEvent(null);
      handleEventSlot(null);
    }
  };

  const onSubmit = (data: FieldValues) => {
    if (data) {
      let newEvents = [...eventsState];

      if (selectedEvent) {
        newEvents = eventsState.filter(
          (event) => event.id !== selectedEvent.id
        );
      }

      let start;
      let end;

      if (moreThanOneDay) {
        start = new Date(`${data.dateStart}T${data.startTime}:00`);
        end = moment(new Date(`${data.dateEnd}T${data.endTime}:00`))
          .add(1, "days")
          .toDate();
      } else {
        start = new Date(`${data.date}T${data.startTime}:00`);
        end = isAllDay
          ? moment(start).add(1, "days").toDate()
          : new Date(`${data.date}T${data.endTime}:00`);
      }

      const id = Math.random();
      const newData = {
        id,
        start,
        end,
        title: data.title,
        desc: data.desc,
        allDay: data.allDay,
        eventColor: data.eventColor,
      };

      newEvents.push(newData);

      handleEventsState(newEvents);
      handleIsModal(false);
      handleSelectedEvent(null);
      handleEventSlot(null);
    }
  };

  let correctLeft = document.body.clientWidth / 2;
  let correctRight = document.body.clientHeight / 2;
  let date;

  if (top && left) {
    correctLeft = +left - 100;
    correctRight = +top + 40;

    date = moment(eventSlot?.start).format("YYYY-MM-DD");
  } else {
    if (click) {
      correctLeft = click!.x - 100;
      correctRight = click!.y + 40;
    }
  }

  if (correctLeft < 0) {
    correctLeft = 2;
  } else if (correctLeft > document.body.clientWidth - 205) {
    correctLeft = document.body.clientWidth - 205;
  }

  if (correctRight > document.body.clientHeight - 400) {
    correctRight = document.body.clientHeight - 400;
  }

  useEffect(() => {
    if (selectedEvent) {
      reset({
        title: selectedEvent?.title || "",
        date: selectedEvent
          ? convertDate(selectedEvent.start, DateStyle.YYYYMMDD)
          : moment(eventSlot?.start).format("YYYY-MM-DD"),
        allDay: selectedEvent?.allDay || false,
        startTime: selectedEvent
          ? convertDate(selectedEvent.start, DateStyle.HHmm)
          : moment(eventSlot?.start).format("HH:mm"),
        endTime: selectedEvent
          ? convertDate(selectedEvent.end, DateStyle.HHmm)
          : moment(eventSlot?.end).format("HH:mm"),
        eventColor: selectedEvent?.eventColor || "default",
        desc: selectedEvent?.desc || "",
        dateStart:
          selectedEvent || moreThanOneDay
            ? convertDate(selectedEvent.start, DateStyle.YYYYMMDD)
            : moment(eventSlot?.start).format("YYYY-MM-DD"),
        dateEnd:
          selectedEvent || moreThanOneDay
            ? convertDate(selectedEvent.end, DateStyle.YYYYMMDD)
            : moment(eventSlot?.end).format("YYYY-MM-DD"),
      });

      if (selectedEvent.allDay) {
        setIsAllDay(true);
      }

      if (isEventMoreThanOneDay(selectedEvent.start, selectedEvent.end)) {
        setMoreThanOneDay(true);
        setIsAllDay(true);
      }
    }

    if (eventSlot) {
      if (isEventMoreThanOneDay(eventSlot.start, eventSlot.end)) {
        setMoreThanOneDay(true);
        setIsAllDay(true);
      } else if (isEventAllDay(eventSlot.start, eventSlot.end)) {
        setIsAllDay(true);
      }
    }

    if (!selectedEvent && eventSlot) {
      reset({
        title: "",
        dateStart: moment(eventSlot.start).format("YYYY-MM-DD"),
        dateEnd: moment(eventSlot.end).subtract(1, "days").format("YYYY-MM-DD"),
        startTime: moment(eventSlot.start).format("HH:mm"),
        endTime: moment(eventSlot.end).format("HH:mm"),
        allDay: false,
        eventColor: "default",
        desc: "",
        date: moment(eventSlot.start).format("YYYY-MM-DD"),
      });
    }
  }, [selectedEvent, eventSlot, reset, moreThanOneDay]);

  const isAllDayChecked = isAllDay || moreThanOneDay;

  return (
    <div
      style={{ top: correctRight, left: correctLeft }}
      className="modal-window"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="modal-window-form">
        <label className="modal-window-delete">
          <span>Delete event</span>
          <button
            disabled={!selectedEvent}
            type="button"
            onClick={handleDeletingEvent}
          >
            X
          </button>
        </label>

        <input
          {...register("title", { required: true, maxLength: 30 })}
          placeholder="event name"
          type="text"
          defaultValue={selectedEvent ? selectedEvent.title : ""}
        />
        {errors.title && (
          <span className="modal-window-error-title">
            Max length is 30 symbols!
          </span>
        )}

        {moreThanOneDay ? (
          <>
            <label className="modal-window-date">
              <span>Start:</span>
              <input
                {...register("dateStart", { required: true })}
                placeholder="event date start"
                type="date"
                defaultValue={
                  selectedEvent
                    ? convertDate(selectedEvent.start, DateStyle.YYYYMMDD)
                    : date
                }
              />
            </label>

            <label className="modal-window-date">
              <span>End:</span>
              <input
                {...register("dateEnd", { required: true })}
                placeholder="event date end"
                type="date"
                defaultValue={
                  selectedEvent
                    ? convertDate(selectedEvent.end, DateStyle.YYYYMMDD)
                    : date
                }
              />
            </label>
          </>
        ) : (
          <input
            {...register("date", { required: true })}
            placeholder="event date"
            type="date"
            defaultValue={
              selectedEvent
                ? convertDate(selectedEvent.start, DateStyle.YYYYMMDD)
                : date
            }
          />
        )}

        <label className="modal-window-checkbox">
          <span>All-day event</span>
          <input
            {...register("allDay")}
            onClick={(state) =>
              setIsAllDay((state.target as HTMLInputElement).checked)
            }
            type="checkbox"
            disabled={moreThanOneDay}
            checked={isAllDayChecked}
            defaultValue={isAllDayChecked ? "checked" : ""}
          />
        </label>

        <input
          {...register("startTime", { required: true })}
          placeholder="event time"
          disabled={isAllDay || selectedEvent?.allDay}
          type="time"
          defaultValue={
            selectedEvent
              ? convertDate(selectedEvent.start, DateStyle.HHmm)
              : moment(eventSlot!.start).format("HH:mm")
          }
        />

        <input
          {...register("endTime", { required: true })}
          placeholder="event time"
          type="time"
          disabled={isAllDay || selectedEvent?.allDay}
          defaultValue={
            selectedEvent
              ? convertDate(selectedEvent.end, DateStyle.HHmm)
              : moment(eventSlot!.end).format("HH:mm")
          }
        />

        <label className="modal-window-select">
          <span>Choose color:</span>
          <Controller
            name="eventColor"
            control={control}
            defaultValue={selectedEvent ? selectedEvent.eventColor : "default"}
            render={({ field }) => (
              <select {...field}>
                <option value="default">default</option>
                <option value="green">green</option>
                <option value="red">red</option>
                <option value="yellow">yellow</option>
                <option value="purple">purple</option>
                <option value="pink">pink</option>
                <option value="orange">orange</option>
              </select>
            )}
          />
        </label>

        <input
          {...register("desc")}
          placeholder="notes"
          type="text"
          defaultValue={selectedEvent ? selectedEvent.desc : ""}
        />

        <div className="modal-window-buttons">
          <button
            type="button"
            onClick={() => {
              handleIsModal(false);
              handleSelectedEvent(null);
              handleEventSlot(null);
            }}
          >
            Cancel
          </button>

          <input type="submit" value="Save" />
        </div>
      </form>
    </div>
  );
};
