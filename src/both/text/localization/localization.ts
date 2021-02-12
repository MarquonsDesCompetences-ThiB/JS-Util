import { ELanguage_Code } from "../language_codes.js";

export const texts_dir = process.env.SRC_ROOT + "lang/.js";

/**
 * Default language code
 */
export const default_lang: ELanguage_Code =
  ELanguage_Code[process.env.default_lang];

export { Texts } from "./Texts.js";
