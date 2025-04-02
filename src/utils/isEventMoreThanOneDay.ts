const oneDayTime = 86400000;

export const isEventMoreThanOneDay = (start: Date, end: Date) =>
  end.getTime() - start.getTime() > oneDayTime;