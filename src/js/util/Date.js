'use strict';

/**
Utilities
*/
class Util {
    constructor() {}


    static date_to_str(date, lang) {
        return Utils.getDayName(date.getDay(), lang) + ' ' + date.getDate() + ' ' + Utils.getMonthName(date.getMonth(), lang)
    }

    static formated_date_to_date(formatedDate) {
        var formatedDate = formatedDate.split('-');
        var date = new Date(Number(formatedDate[0]), Number(formatedDate[1]), Number(formatedDate[2]));
        date.setHours(Number(formatedDate[3]));
        date.setMinutes(Number(formatedDate[4]));
        return date;
    }

    static dateToFormatedDate(date) {
        return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + '-' + date.getHours() + '-' + date.getMinutes();
    }

    static get_day_name(weekDayNumber, lg) {
        switch (weekDayNumber) {
            case 0:
                return lang[lg]['Sunday'];
                break;
            case 1:
                return lang[lg]['Monday'];
                break;
            case 2:
                return lang[lg]['Tuesday'];
                break;
            case 3:
                return lang[lg]['Wednesday'];
                break;
            case 4:
                return lang[lg]['Thursday'];
                break;
            case 5:
                return lang[lg]['Friday'];
                break;
            case 6:
                return lang[lg]['Saturday'];
                break;
        }

        return 'Wrong day';
    }

    static get_month_name(monthNumber, lg) {
        switch (monthNumber) {
            case 0:
                return lang[lg]['January'];
                break;
            case 1:
                return lang[lg]['February'];
                break;
            case 2:
                return lang[lg]['March'];
                break;
            case 3:
                return lang[lg]['April'];
                break;
            case 4:
                return lang[lg]['May'];
                break;
            case 5:
                return lang[lg]['June'];
                break;
            case 6:
                return lang[lg]['July'];
                break;
            case 7:
                return lang[lg]['August'];
                break;
            case 8:
                return lang[lg]['September'];
                break;
            case 9:
                return lang[lg]['October'];
                break;
            case 10:
                return lang[lg]['November'];
                break;
            case 11:
                return lang[lg]['December'];
                break;
        }

        return 'Wrong month';
    }
};


module.exports = Util;