/**
 * To validate inputs relative to identities (users, companies)
 */
"use strict";
import { regex, text } from "../../both/_both.js";
export var form_identity;
(function (form_identity) {
    form_identity.minlengthes = {
        pwd: 8,
    };
    form_identity.maxlengthes = {
        login: 25,
        pwd: 25,
        mail: 30,
        tel: 11,
        name: 30,
        surname: 30,
        address: 50,
        address_number: 8,
        zip_code: 8,
        city: 25,
        country: 20,
    };
    /**
     * Check the member address
     * @return {json} If no errors are in address, return undefined
     *                  Otherwise the associated key is set to true :
     *                  {empty, too_long}
     */
    function get_address_error(address) {
        if (!address || address.length == 0) {
            return {
                empty: true,
            };
        }
        else if (address.length >= form_identity.maxlengthes.address) {
            logger.warn =
                "Util_Identity#get_address_error Too long address : " +
                    address.length +
                    " (" +
                    address +
                    ")";
            return {
                too_long: true,
            };
        }
        return undefined;
    }
    form_identity.get_address_error = get_address_error;
    /**
     * Check the member address number
     * @param{string} number
     * @return {json} If no errors are in address, return undefined
     *                  Otherwise the associated key is set to true :
     *                  {empty, too_long}
     */
    function get_address_number_error(number) {
        if (!number || number.length == 0) {
            return {
                empty: true,
            };
        }
        //to ignore special chars => count them
        let special_chars = -1;
        let start_idx = -1;
        do {
            logger.log =
                "Util_Identity#get_address_number_error special_chars : " +
                    special_chars;
            special_chars++;
            start_idx++;
            start_idx = number.indexOf("%", start_idx);
        } while (start_idx >= 0);
        special_chars *= 3;
        if (number.length - special_chars >= form_identity.maxlengthes.address_number) {
            logger.log =
                "Util_Identity#get_address_number_error " +
                    number +
                    " too long : " +
                    number.length +
                    " >= " +
                    form_identity.maxlengthes.address_number;
            return {
                too_long: true,
            };
        }
        return undefined;
    }
    form_identity.get_address_number_error = get_address_number_error;
    /**
     * Check the member city
     * @return {json} If no errors are in city, return undefined
     *                  Otherwise the associated key is set
     *                  to true : {empty, too_long}
     */
    function get_city_error(city) {
        if (!city || city.length == 0) {
            return {
                empty: true,
            };
        }
        else if (city.length >= form_identity.maxlengthes.city) {
            return {
                too_long: true,
            };
        }
        return undefined;
    }
    form_identity.get_city_error = get_city_error;
    /**
     * Check the member country
     * @return {json} If no errors are in country, return undefined
     *                  Otherwise the associated key is set
     *                  to true : {empty, too_long}
     */
    function get_country_error(country) {
        if (!country || country.length == 0) {
            return {
                empty: true,
            };
        }
        else if (country.length >= form_identity.maxlengthes.country) {
            return {
                too_long: true,
            };
        }
        return undefined;
    }
    form_identity.get_country_error = get_country_error;
    /**
     * Check the member login
     * @return {json} If no errors are in login, return undefined
     *                  Otherwise the associated key is set
     *                  to true : {empty, too_long,
     *                            mail_format, special_chars}
     */
    function get_login_error(login) {
        if (!login || login.length == 0) {
            return {
                empty: true,
            };
        }
        if (login.length >= form_identity.maxlengthes.login) {
            return {
                too_long: true,
            };
        }
        if (regex.is_email_address(login)) {
            return {
                mail_format: true,
            };
        }
        if (text.string.has_special_characters(login)) {
            return {
                special_chars: true,
            };
        }
        return undefined;
    }
    form_identity.get_login_error = get_login_error;
    /**
     * Check the member mail
     * @return {json} If no errors are in mail, return undefined
     *                  Otherwise the associated key is set
     *                  to true : {empty, too_long, wrong_format}
     */
    function get_mail_error(mail) {
        if (!mail || mail.length == 0) {
            return {
                empty: true,
            };
        }
        if (mail.length >= form_identity.maxlengthes.mail) {
            return {
                too_long: true,
            };
        }
        if (!regex.is_email_address(mail)) {
            return {
                wrong_format: true,
            };
        }
        return undefined;
    }
    form_identity.get_mail_error = get_mail_error;
    /**
     * Check the member name
     * @return {json} If no errors are in name, return undefined
     *                  Otherwise the associated key is set
     *                  to true : {empty, too_long}
     */
    function get_name_error(name) {
        if (!name || name.length == 0) {
            return {
                empty: true,
            };
        }
        else if (name.length >= form_identity.maxlengthes.name) {
            return {
                too_long: true,
            };
        }
        return undefined;
    }
    form_identity.get_name_error = get_name_error;
    /**
     * Check the member password
     * @return {json} If no errors are in pwds, return undefined
     *                  Otherwise the associated key is set
     *                  to true : {empty, too_short, too_long, empty_confirm, different}
     */
    function get_pwd_error(pwd, pwd_confirm) {
        if (!pwd || pwd.length === 0) {
            return {
                empty: true,
            };
        }
        else if (pwd.length < form_identity.minlengthes.pwd) {
            return {
                too_short: true,
            };
        }
        else if (pwd.length >= form_identity.maxlengthes.pwd) {
            return {
                too_long: true,
            };
        }
        else if (pwd_confirm == null || pwd_confirm.length === 0) {
            return {
                empty_confirm: true,
            };
        }
        else if (pwd.localeCompare(pwd_confirm)) {
            //pwds are different
            return {
                different: true,
            };
        }
        return undefined;
    }
    form_identity.get_pwd_error = get_pwd_error;
    /**
     * Check the member surname
     * @return {json} If no errors are in surname, return undefined
     *                  Otherwise the associated key is set
     *                  to true : {empty, too_long}
     */
    function get_surname_error(surname) {
        if (!surname || surname.length == 0) {
            return {
                empty: true,
            };
        }
        else if (surname.length >= form_identity.maxlengthes.surname) {
            return {
                too_long: true,
            };
        }
        return undefined;
    }
    form_identity.get_surname_error = get_surname_error;
    /**
     *
     * @param {string*} tel
     */
    function get_tel_error(tel) {
        if (typeof tel === "undefined" || tel.length === 0) {
            return {
                empty: true,
            };
        }
        else if (tel.length >= form_identity.maxlengthes.tel) {
            return {
                too_long: true,
            };
        }
        if (!regex.is_phone_number(tel)) {
            return {
                wrong_format: true,
            };
        }
        return undefined;
    }
    form_identity.get_tel_error = get_tel_error;
    function get_zip_code_error(zip_code) {
        const zip_str = new String(zip_code);
        if (!zip_code || zip_str.length == 0) {
            return {
                empty: true,
            };
        }
        else if (zip_str.length >= form_identity.maxlengthes.zip_code) {
            return {
                too_long: true,
            };
        }
        else if (!regex.is_zip_code(zip_code)) {
            return {
                wrong_format: true,
            };
        }
        return undefined;
    }
    form_identity.get_zip_code_error = get_zip_code_error;
})(form_identity || (form_identity = {}));
//# sourceMappingURL=form_identity.js.map