"use strict";
/**
    Useful regex
*/
export function has_value(val) {
    return val !== undefined && val != "";
}
export function has_only_numbers(str) {
    return /[0-9]/.test(str);
}
export function is_number(val) {
    return typeof val === "number" || val instanceof Number;
}
export function has_lower_case(str) {
    return /[a-z]/.test(str);
}
export function has_upper_case(str) {
    return /[A-Z]/.test(str);
}
export function is_email_address(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
}
//
// === PHONE ===
export const phone_number = {
    str: `(\+\d{11})|(\d{10})`,
    reg: /^(\+\d{11})|(\d{10})$/,
};
export function is_phone_number(no) {
    return phone_number.reg.test(no);
}
//
// === WEBSITE ===
export const website = {
    str: `((https?):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*`,
    reg: /^((https?):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/,
};
export function is_website(url) {
    return website.reg.test(url);
}
//
// === ZIP CODE ===
export const zip_code = {
    str: `\d{5}`,
    reg: /^\d{5}$/,
};
export function is_zip_code(no) {
    return zip_code.reg.test(no);
}
//# sourceMappingURL=_regex.js.map