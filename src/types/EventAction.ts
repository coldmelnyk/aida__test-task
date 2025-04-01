import { MyEvent } from "./MyEvent";
import { stringOrDate } from "react-big-calendar";

export interface EventAction {
  event: MyEvent;
  start: stringOrDate;
  end: stringOrDate;
  isAllDay?: boolean;
}
