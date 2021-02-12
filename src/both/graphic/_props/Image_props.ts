"use strict";
import { obj } from "#both";

export abstract class Image_props extends obj.Obj {
  protected name: string;
  protected tooltip: string;
  protected path: string;

  protected registration_date: Date;

  constructor(obj?) {
    super(obj);
  }
}
