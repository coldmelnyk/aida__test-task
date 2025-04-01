export interface MyEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  eventColor: string;
  allDay?: boolean;
  desc?: string;
}