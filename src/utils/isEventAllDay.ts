const oneDayTime = 86400000;

export const isEventAllDay = (start: Date, end: Date) =>
  end.getTime() - start.getTime() === oneDayTime;