import React from "react";
import { SlotInfo } from "react-big-calendar";
import { FieldValues, useForm } from "react-hook-form";
import moment from "moment";
import { Event } from "../../types";

interface Props {
  top: number | undefined;
  left: number | undefined;
  handleEventsState: React.Dispatch<React.SetStateAction<Event[]>>;
  handleIsModal: React.Dispatch<React.SetStateAction<boolean>>;
  eventSlot: SlotInfo | null;
}

export const ModalOfEvents: React.FC<Props> = ({
  top,
  left,
  handleEventsState,
  handleIsModal,
  eventSlot,
}) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: FieldValues) => {
    if (data) {
      const start = new Date(`${data.date}T${data.startTime}:00`);
      const end = new Date(`${data.date}T${data.endTime}:00`);
      const id = Math.random();
      const newData = {
        id,
        start,
        end,
        title: data.title,
        desc: data.desc,
      };

      handleEventsState((prev) => [...prev, newData]);
      handleIsModal(false);
    }

    console.log(data);
  };

  if (top && left) {
    let correctLeft = +left - 100;

    if (correctLeft < 0) {
      correctLeft = 2;
    } else if (correctLeft > document.body.clientWidth - 205) {
      correctLeft = document.body.clientWidth - 205;
    }

    let correctRight = +top + 40;

    if (correctRight > document.body.clientHeight - 120) {
      correctRight = document.body.clientHeight - 120;
    }

    const date = moment(eventSlot?.start).format("YYYY-MM-DD");

    return (
      <div
        style={{ top: correctRight, left: correctLeft }}
        className="modal-window"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="modal-window-form">
          <div className="modal-window-close-wrapper">
            <button type="button" onClick={() => handleIsModal(false)}>
              X
            </button>
          </div>
          <input
            {...register("title", { required: true })}
            placeholder="event name"
            type="text"
          />
          <input
            {...register("date", { required: true })}
            placeholder="event date"
            type="date"
            value={date}
          />
          <input
            {...register("startTime", { required: true })}
            placeholder="event time"
            type="time"
            defaultValue={"00:00"}
          />
          <input
            {...register("endTime", { required: true })}
            placeholder="event time"
            type="time"
            defaultValue={"00:00"}
          />
          <input {...register("desc")} placeholder="notes" type="text" />
          <div className="modal-window-buttons">
            <button type="button" onClick={() => handleIsModal(false)}>
              Cancel
            </button>
            <input type="submit" value="Save" />
          </div>
        </form>
      </div>
    );
  }
};
