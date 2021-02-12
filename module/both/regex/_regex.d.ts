/**
    Useful regex
*/
export declare function has_value(val: any): boolean;
export declare function has_only_numbers(str: any): boolean;
export declare function is_number(val: any): boolean;
export declare function has_lower_case(str: any): boolean;
export declare function has_upper_case(str: any): boolean;
export declare function is_email_address(emailAddress: any): boolean;
export declare const phone_number: {
    str: string;
    reg: RegExp;
};
export declare function is_phone_number(no: any): boolean;
export declare const website: {
    str: string;
    reg: RegExp;
};
export declare function is_website(url: any): boolean;
export declare const zip_code: {
    str: string;
    reg: RegExp;
};
export declare function is_zip_code(no: any): boolean;
