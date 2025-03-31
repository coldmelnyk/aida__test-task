import moment from "moment";
import { DateStyle } from "../types/enums";

export const convertDate = (date: Date, style: DateStyle) => {
  const formattedDate = moment(date, "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");

  if (style === DateStyle.YYYYMMDD) {
    return formattedDate.format(DateStyle.YYYYMMDD);
  }

  if (style === DateStyle.HHmm) {
    return formattedDate.format(DateStyle.HHmm);
  }
};
