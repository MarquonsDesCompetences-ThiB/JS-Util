"use strict";
import { obj } from "@src/both/_both.js";

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
    super(obj);
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
