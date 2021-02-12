export declare namespace form_identity {
    const minlengthes: {
        pwd: number;
    };
    const maxlengthes: {
        login: number;
        pwd: number;
        mail: number;
        tel: number;
        name: number;
        surname: number;
        address: number;
        address_number: number;
        zip_code: number;
        city: number;
        country: number;
    };
    /**
     * Check the member address
     * @return {json} If no errors are in address, return undefined
     *                  Otherwise the associated key is set to true :
     *                  {empty, too_long}
     */
    function get_address_error(address: any): {
        empty: boolean;
        too_long?: undefined;
    } | {
        too_long: boolean;
        empty?: undefined;
    };
    /**
     * Check the member address number
     * @param{string} number
     * @return {json} If no errors are in address, return undefined
     *                  Otherwise the associated key is set to true :
     *                  {empty, too_long}
     */
    function get_address_number_error(number: any): {
        empty: boolean;
        too_long?: undefined;
    } | {
        too_long: boolean;
        empty?: undefined;
    };
    /**
     * Check the member city
     * @return {json} If no errors are in city, return undefined
     *                  Otherwise the associated key is set
     *                  to true : {empty, too_long}
     */
    function get_city_error(city: any): {
        empty: boolean;
        too_long?: undefined;
    } | {
        too_long: boolean;
        empty?: undefined;
    };
    /**
     * Check the member country
     * @return {json} If no errors are in country, return undefined
     *                  Otherwise the associated key is set
     *                  to true : {empty, too_long}
     */
    function get_country_error(country: any): {
        empty: boolean;
        too_long?: undefined;
    } | {
        too_long: boolean;
        empty?: undefined;
    };
    /**
     * Check the member login
     * @return {json} If no errors are in login, return undefined
     *                  Otherwise the associated key is set
     *                  to true : {empty, too_long,
     *                            mail_format, special_chars}
     */
    function get_login_error(login: any): {
        empty: boolean;
        too_long?: undefined;
        mail_format?: undefined;
        special_chars?: undefined;
    } | {
        too_long: boolean;
        empty?: undefined;
        mail_format?: undefined;
        special_chars?: undefined;
    } | {
        mail_format: boolean;
        empty?: undefined;
        too_long?: undefined;
        special_chars?: undefined;
    } | {
        special_chars: boolean;
        empty?: undefined;
        too_long?: undefined;
        mail_format?: undefined;
    };
    /**
     * Check the member mail
     * @return {json} If no errors are in mail, return undefined
     *                  Otherwise the associated key is set
     *                  to true : {empty, too_long, wrong_format}
     */
    function get_mail_error(mail: any): {
        empty: boolean;
        too_long?: undefined;
        wrong_format?: undefined;
    } | {
        too_long: boolean;
        empty?: undefined;
        wrong_format?: undefined;
    } | {
        wrong_format: boolean;
        empty?: undefined;
        too_long?: undefined;
    };
    /**
     * Check the member name
     * @return {json} If no errors are in name, return undefined
     *                  Otherwise the associated key is set
     *                  to true : {empty, too_long}
     */
    function get_name_error(name: any): {
        empty: boolean;
        too_long?: undefined;
    } | {
        too_long: boolean;
        empty?: undefined;
    };
    /**
     * Check the member password
     * @return {json} If no errors are in pwds, return undefined
     *                  Otherwise the associated key is set
     *                  to true : {empty, too_short, too_long, empty_confirm, different}
     */
    function get_pwd_error(pwd: any, pwd_confirm: any): {
        empty: boolean;
        too_short?: undefined;
        too_long?: undefined;
        empty_confirm?: undefined;
        different?: undefined;
    } | {
        too_short: boolean;
        empty?: undefined;
        too_long?: undefined;
        empty_confirm?: undefined;
        different?: undefined;
    } | {
        too_long: boolean;
        empty?: undefined;
        too_short?: undefined;
        empty_confirm?: undefined;
        different?: undefined;
    } | {
        empty_confirm: boolean;
        empty?: undefined;
        too_short?: undefined;
        too_long?: undefined;
        different?: undefined;
    } | {
        different: boolean;
        empty?: undefined;
        too_short?: undefined;
        too_long?: undefined;
        empty_confirm?: undefined;
    };
    /**
     * Check the member surname
     * @return {json} If no errors are in surname, return undefined
     *                  Otherwise the associated key is set
     *                  to true : {empty, too_long}
     */
    function get_surname_error(surname: any): {
        empty: boolean;
        too_long?: undefined;
    } | {
        too_long: boolean;
        empty?: undefined;
    };
    /**
     *
     * @param {string*} tel
     */
    function get_tel_error(tel: any): {
        empty: boolean;
        too_long?: undefined;
        wrong_format?: undefined;
    } | {
        too_long: boolean;
        empty?: undefined;
        wrong_format?: undefined;
    } | {
        wrong_format: boolean;
        empty?: undefined;
        too_long?: undefined;
    };
    function get_zip_code_error(zip_code: any): {
        empty: boolean;
        too_long?: undefined;
        wrong_format?: undefined;
    } | {
        too_long: boolean;
        empty?: undefined;
        wrong_format?: undefined;
    } | {
        wrong_format: boolean;
        empty?: undefined;
        too_long?: undefined;
    };
}
