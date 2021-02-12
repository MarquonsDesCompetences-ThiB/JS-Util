"use strict";
import { File } from "../File.js";

export abstract class Csv_File_props extends File {
  public nb_cols: number;
  public col_names: string[];

  /*
    Object
    For each column id, for each destination value, 
    associate the column's values that should be converted 
    to the destination value
  */
  protected values_associations: Object;
}
