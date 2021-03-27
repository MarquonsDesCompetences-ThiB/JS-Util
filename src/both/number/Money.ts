"use strict";
import { obj } from "@both_types/_types.js";

export class Money extends obj.Obj {
  /**
   * Currency
   * Index from number.money.currencies
   */
  protected currency: number;

  /**
   * Amount
   */
  #_mnt: number;

  protected tax_incl: boolean; //Boolean

  constructor(obj = undefined) {
    super();
    if (obj) {
      this.set(obj, undefined, true);
    }
  }

  get amount() {
    return this.#_mnt;
  }

  set amount(amount) {
    this.#_mnt = amount;
  }

  get_amount(currency) {
    if (currency !== this.currency) {
      return 0;
    }

    return this.#_mnt;
  }
}
