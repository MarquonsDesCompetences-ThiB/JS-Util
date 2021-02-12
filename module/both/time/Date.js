"use strict";
/**
Utilities
*/
export function date_to_str(date, lang) {
    return (get_day_name(date.getDay(), lang) +
        " " +
        date.getDate() +
        " " +
        get_month_name(date.getMonth(), lang));
}
export function formated_date_to_date(formatedDate) {
    var formatedDate = formatedDate.split("-");
    var date = new Date(Number(formatedDate[0]), Number(formatedDate[1]), Number(formatedDate[2]));
    date.setHours(Number(formatedDate[3]));
    date.setMinutes(Number(formatedDate[4]));
    return date;
}
export function dateToFormatedDate(date) {
    return (date.getFullYear() +
        "-" +
        date.getMonth() +
        "-" +
        date.getDate() +
        "-" +
        date.getHours() +
        "-" +
        date.getMinutes());
}
export function get_day_name(weekDayNumber, texts) {
    switch (weekDayNumber) {
        case 0:
            return texts.get("Sunday");
            break;
        case 1:
            return texts.get("Monday");
            break;
        case 2:
            return texts.get("Tuesday");
            break;
        case 3:
            return texts.get("Wednesday");
            break;
        case 4:
            return texts.get("Thursday");
            break;
        case 5:
            return texts.get("Friday");
            break;
        case 6:
            return texts.get("Saturday");
            break;
    }
    return "Wrong day";
}
export function get_month_name(monthNumber, texts) {
    switch (monthNumber) {
        case 0:
            return texts.get("January");
            break;
        case 1:
            return texts.get("February");
            break;
        case 2:
            return texts.get("March");
            break;
        case 3:
            return texts.get("April");
            break;
        case 4:
            return texts.get("May");
            break;
        case 5:
            return texts.get("June");
            break;
        case 6:
            return texts.get("July");
            break;
        case 7:
            return texts.get("August");
            break;
        case 8:
            return texts.get("September");
            break;
        case 9:
            return texts.get("October");
            break;
        case 10:
            return texts.get("November");
            break;
        case 11:
            return texts.get("December");
            break;
    }
    return "Wrong month";
}
//# sourceMappingURL=date.js.map