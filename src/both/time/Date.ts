"use strict";
import { localization } from "@both_text/_text.js";
import Texts = localization.Texts;

/**
Utilities
*/
export function date_to_str(date, lang) {
  return (
    get_day_name(date.getDay(), lang) +
    " " +
    date.getDate() +
    " " +
    get_month_name(date.getMonth(), lang)
  );
}

export function formated_date_to_date(formatedDate) {
  var formatedDate = formatedDate.split("-");
  var date = new Date(
    Number(formatedDate[0]),
    Number(formatedDate[1]),
    Number(formatedDate[2])
  );
  date.setHours(Number(formatedDate[3]));
  date.setMinutes(Number(formatedDate[4]));
  return date;
}

export function dateToFormatedDate(date) {
  return (
    date.getFullYear() +
    "-" +
    date.getMonth() +
    "-" +
    date.getDate() +
    "-" +
    date.getHours() +
    "-" +
    date.getMinutes()
  );
}

export function get_day_name(weekDayNumber, texts: Texts) {
  switch (weekDayNumber) {
    case 0:
      return texts.get_localization("Sunday");
      break;
    case 1:
      return texts.get_localization("Monday");
      break;
    case 2:
      return texts.get_localization("Tuesday");
      break;
    case 3:
      return texts.get_localization("Wednesday");
      break;
    case 4:
      return texts.get_localization("Thursday");
      break;
    case 5:
      return texts.get_localization("Friday");
      break;
    case 6:
      return texts.get_localization("Saturday");
      break;
  }

  return "Wrong day";
}

export function get_month_name(monthNumber, texts: Texts) {
  switch (monthNumber) {
    case 0:
      return texts.get_localization("January");
      break;
    case 1:
      return texts.get_localization("February");
      break;
    case 2:
      return texts.get_localization("March");
      break;
    case 3:
      return texts.get_localization("April");
      break;
    case 4:
      return texts.get_localization("May");
      break;
    case 5:
      return texts.get_localization("June");
      break;
    case 6:
      return texts.get_localization("July");
      break;
    case 7:
      return texts.get_localization("August");
      break;
    case 8:
      return texts.get_localization("September");
      break;
    case 9:
      return texts.get_localization("October");
      break;
    case 10:
      return texts.get_localization("November");
      break;
    case 11:
      return texts.get_localization("December");
      break;
  }

  return "Wrong month";
}
