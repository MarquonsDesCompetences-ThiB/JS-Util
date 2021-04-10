import { obj } from "../types/_types.js";
export declare class Money extends obj.Obj {
    #private;
    /**
     * Currency
     * Index from number.money.currencies
     */
    protected currency: number;
    protected tax_incl: boolean;
    constructor(obj?: any);
    get amount(): number;
    set amount(amount: number);
    get_amount(currency: any): number;
}
