"use strict";
import { obj } from "@both_types/_types.js";

export abstract class Image_props extends obj.Obj {
  protected name: string;
  protected tooltip: string;
  protected path: string;

  protected registration_date: Date;

  constructor(obj?: any) {
    super();
    if (obj) {
      this.set(obj, undefined, true);
    }
  }
}
