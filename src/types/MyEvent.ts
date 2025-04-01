export interface MyEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  desc?: string;
}