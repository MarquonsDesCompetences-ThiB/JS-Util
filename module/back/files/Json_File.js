"use strict";
import { Json_File_props } from "./_props/Json_File_props.js";
import json_file from "jsonfile";
import { createReadStream } from "fs";
import fs_extra from "fs-extra";
export class Json_File extends Json_File_props {
    async read_key(key) {
        return new Promise(async (success, reject) => {
            const keys = key ? [key] : key;
            const path = this.path ? this.full_path : this.full_name;
            {
                if (path == null) {
                    const msg = "Undefined full path ; path : " +
                        this.path +
                        " name : " +
                        this.name;
                    logger.error = msg;
                    return reject(msg);
                }
                if (!fs_extra.pathExistsSync(path)) {
                    const msg = "Unexisting file " + path;
                    logger.error = msg;
                    return reject(msg);
                }
            }
            let parsing_str = "";
            let val_strs = [];
            for (let i = 0; i < keys.length; i++) {
                val_strs.push("");
            }
            //index in keys of the one found while parsing
            let key_found_idx = -1;
            //if parsing a value or parsing a key
            let parsing_value = false;
            //
            // To parse values
            let bDelimiter_found = false;
            let nb_key_values_parsed = 0; //<keys.length
            let nb_opened = {
                //
                // Scopes
                braces: 0,
                brackets: 0,
                parenthesis: 0,
                //
                // Strings
                quote: 0,
                double_quotes: 0,
                template_quote: 0,
            };
            function new_chars_delimiters_regex() {
                //
                // Scopes
                const brace_open = `[^\\\\]\{`;
                const brace_close = `[^\\\\]\}`;
                const bracket_open = `[^\\\\]\[`;
                const bracket_close = `[^\\\\]\]`;
                const parenthese_open = `[^\\\\]\(`;
                const parenthese_close = `[^\\\\]\)`;
                //
                // Strings
                const quote = `[^\\\\]\'`;
                const double_quotes = `[^\\\\]\"`;
                const template_quote = `[^\\\\]\``;
                const comma = `,`;
                return new RegExp(`${brace_open}|${brace_close}|${bracket_open}|${bracket_close}|${parenthese_open}|${parenthese_close}|${quote}|${double_quotes}|${template_quote}|${comma}`);
            }
            const chars_delimiters_reg = new_chars_delimiters_regex();
            const stream = createReadStream(path);
            stream.on("data", (chunk) => {
                parsing_str += chunk;
                //
                // Parsing a value
                if (parsing_value) {
                    while (true) {
                        const first_delimiter_char = parsing_str.match(chars_delimiters_reg);
                        if (!first_delimiter_char) {
                            parsing_str += parsing_str;
                            return; //end of current string without any interesting character
                        }
                        //
                        // else a char is found
                        bDelimiter_found = true;
                        switch (first_delimiter_char[0]) {
                            //
                            // === Scopes
                            case "{":
                                nb_opened.braces++;
                                break;
                            case "}":
                                nb_opened.braces--;
                                break;
                            case "[":
                                nb_opened.brackets++;
                                break;
                            case "]":
                                nb_opened.brackets--;
                                break;
                            case "(":
                                nb_opened.parenthesis++;
                                break;
                            case ")":
                                nb_opened.parenthesis--;
                                break;
                            //
                            // === Strings
                            case "'":
                                nb_opened.quote = 1 - nb_opened.quote;
                                break;
                            case '"':
                                nb_opened.double_quotes = 1 - nb_opened.double_quotes;
                                break;
                            case "`":
                                nb_opened.template_quote = 1 - nb_opened.template_quote;
                                break;
                            case ",":
                                //
                                // Value is over if no pending opened scope or quote
                                if (!nb_opened.braces &&
                                    !nb_opened.brackets &&
                                    !nb_opened.parenthesis &&
                                    !nb_opened.quote &&
                                    !nb_opened.double_quotes &&
                                    !nb_opened.template_quote) {
                                    parsing_value = false;
                                    //
                                    // Value is fetched => call success
                                    if (key_found_idx >= 0) {
                                        key_found_idx = -1;
                                        const comma_idx = parsing_str.search(/,/);
                                        val_strs[key_found_idx] += parsing_str.slice(0, comma_idx);
                                        nb_key_values_parsed++;
                                        if (nb_key_values_parsed === keys.length) {
                                            return success(val_strs);
                                        }
                                    }
                                }
                                break;
                        }
                    }
                }
                //
                // Look for key
                else {
                    //
                    // remove beginning spaces
                    parsing_str = parsing_str.replace(/^\s*/, "");
                    //
                    // check/remove double quotes
                    if (parsing_str[0] !== '"') {
                        throw SyntaxError("Expected a key but it has no double-quotes (in : " + parsing_str);
                    }
                    parsing_str = parsing_str.slice(1);
                    const curr_key = parsing_str.match(/^\w+(?=\")/);
                    if (!curr_key) {
                        throw SyntaxError("No ending double-quotes found at key " + parsing_str);
                    }
                    key_found_idx = keys.indexOf(curr_key[0]);
                    //
                    // Consume the ending double_quotes and semi-column
                    {
                        const col_idx = parsing_str.search(/:/);
                        if (!col_idx) {
                            throw SyntaxError("No semi-column found at key " + chunk);
                        }
                        parsing_str = parsing_str.slice(col_idx + 1);
                    }
                    parsing_value = true; //will now parse value
                }
            });
        });
    }
    async read() {
        const full_path = this.full_path;
        {
            if (full_path == null ||
                // because full_path is the cocnatenation of both below
                this.path == null ||
                this.name == null) {
                const msg = "Undefined full path ; path : " + this.path + " name : " + this.name;
                logger.error = msg;
                throw new ReferenceError(msg);
            }
            if (!fs_extra.pathExistsSync(full_path)) {
                const msg = "Unexisting file " + full_path;
                logger.error = msg;
                throw new ReferenceError(msg);
            }
        }
        return json_file
            .readFile(full_path)
            .then((obj) => {
            logger.info = "Json file " + this.name + " parsed";
            this.content = obj;
            return this.content;
        })
            .catch((err) => {
            err.message = "Error reading file " + full_path + " as json : " + err;
            logger.error = err.message;
            this.content = undefined;
            throw err;
        });
    }
    async read_keys(keys, force_read) {
        //
        // Read file if needed
        {
            if (!this.content || force_read) {
                return this.read().then(() => {
                    return this.read_keys(keys);
                });
            }
        }
        const ret = {};
        keys.forEach((key) => {
            ret[key] = this.content[key];
        });
        return Promise.resolve(ret);
    }
    async write(data) {
        const full_path = this.full_path;
        if (full_path == null ||
            //because full_path is the concatenation of both below
            this.name == null ||
            this.path == null) {
            const msg = "Undefined full path ; path : " + this.path + " name : " + this.name;
            logger.error = msg;
            throw new ReferenceError(msg);
        }
        //
        // Json
        {
            fs_extra.ensureFileSync(full_path);
            return json_file
                .writeFile(full_path, data ? data : this.content)
                .then(() => {
                if (data) {
                    this.content = data;
                }
                logger.log = "File " + full_path + " is written";
            })
                .catch((err) => {
                err.message = "Error writing file " + full_path + " : " + err;
                throw err;
            });
        }
    }
}
//# sourceMappingURL=Json_File.js.map