import { MyEvent } from "../types";
import moment from "moment";

export const myEvents: MyEvent[] = [
  {
    id: 1,
    title: "Long Event",
    start: moment("2025-04-29").toDate(),
    end: moment("2025-05-01").toDate(),
    allDay: true,
    eventColor: "default",
  },
];
