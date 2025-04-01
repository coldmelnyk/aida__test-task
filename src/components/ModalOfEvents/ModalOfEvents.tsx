import React, { useState } from "react";
import { SlotInfo } from "react-big-calendar";
import { FieldValues, useForm } from "react-hook-form";
import moment from "moment";
import { MyEvent } from "../../types";
import { convertDate } from "../../utils";
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
  const { register, handleSubmit } = useForm();
  const [isAllDay, setIsAllDay] = useState(false);

  const onSubmit = (data: FieldValues) => {
    if (data) {
      let newEvents = [...eventsState];

      if (selectedEvent) {
        newEvents = eventsState.filter(
          (event) => event.id !== selectedEvent.id
        );
      }

      const start = new Date(`${data.date}T${data.startTime}:00`);
      const end = isAllDay
        ? moment(start).add(1, "days").toDate()
        : new Date(`${data.date}T${data.endTime}:00`);
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

  let correctLeft;
  let correctRight;
  let date;

  if (top && left) {
    correctLeft = +left - 100;
    correctRight = +top + 40;

    date = moment(eventSlot?.start).format("YYYY-MM-DD");
  } else {
    correctLeft = click!.x - 100;
    correctRight = click!.y + 40;
  }

  if (correctLeft < 0) {
    correctLeft = 2;
  } else if (correctLeft > document.body.clientWidth - 205) {
    correctLeft = document.body.clientWidth - 205;
  }

  if (correctRight > document.body.clientHeight - 210) {
    correctRight = document.body.clientHeight - 210;
  }

  return (
    <div
      style={{ top: correctRight, left: correctLeft }}
      className="modal-window"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="modal-window-form">
        <label className="modal-window-delete">
          <span>Delete event</span>
          <button
            type="button"
            onClick={() => {
              handleIsModal(false);
              handleSelectedEvent(null);
              handleEventSlot(null);
            }}
          >
            X
          </button>
        </label>

        <input
          {...register("title", { required: true })}
          placeholder="event name"
          type="text"
          defaultValue={selectedEvent ? selectedEvent.title : ""}
        />

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

        <label className="modal-window-checkbox">
          <span>All-day event</span>
          <input
            {...register("allDay")}
            onClick={(state) =>
              setIsAllDay((state.target as HTMLInputElement).checked)
            }
            type="checkbox"
            defaultChecked={selectedEvent ? selectedEvent.allDay : false}
          />
        </label>

        <input
          {...register("startTime", { required: true })}
          placeholder="event time"
          disabled={isAllDay}
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
          disabled={isAllDay}
          defaultValue={
            selectedEvent
              ? convertDate(selectedEvent.end, DateStyle.HHmm)
              : moment(eventSlot!.end).format("HH:mm")
          }
        />

        <label className="modal-window-select">
          <span>Choose color:</span>
          <select
            {...register("eventColor")}
            name="Color"
            id="modal-color-select"
            defaultValue={selectedEvent ? selectedEvent.eventColor : "default"}
          >
            <option value="default">default</option>
            <option value="green">green</option>
            <option value="red">red</option>
            <option value="yellow">yellow</option>
            <option value="purple">purple</option>
            <option value="pink">pink</option>
            <option value="orange">orange</option>
          </select>
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
