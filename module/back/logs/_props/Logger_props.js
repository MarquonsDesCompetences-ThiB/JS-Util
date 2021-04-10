"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __f_p;
import stream from "stream";
import fs_extra from "fs-extra";
//import File_  from process.env.SRC_ROOT + "dist/js/util/files/File.js";
import output from "output-manager";
import { join as join_path } from "path";
export class Logger_props extends stream.Writable /*implements NodeJS.WriteStream*/ {
    /**
     * https://nodejs.org/api/stream.html#stream_implementing_a_writable_stream
     *
     * @param file_name_prefix
     * @param other_stream_to_call Opional stream to call ; for example, original std.out
     * @param writable_stream_opts
     */
    constructor(path = join_path(process.env.SRC_ROOT ? process.env.SRC_ROOT : "", "logs"), file_name_prefix = "", other_stream_to_call, writable_stream_opts) {
        super(writable_stream_opts);
        __f_p.set(this, void 0); //file_path
        {
            if (other_stream_to_call) {
                this.add_stream_to_call(other_stream_to_call);
            }
        }
        {
            this.logs = new output.Out();
            this.logs.level_str = "DEBUG";
            this.logs.level = output.LogLevel.DEBUG;
        }
        {
            const prefix = file_name_prefix + (file_name_prefix.length > 0 ? "-" : "");
            this.file_desc = undefined;
            this.file_path = join_path(path, prefix +
                this.logs.level_str +
                "-" +
                new Date().toLocaleTimeString() +
                ".log");
        }
        {
            this.logs.output = (msg) => {
                this.write(msg, (error_or_null) => {
                    if (error_or_null) {
                        console.error("Couldn't write log file : " + error_or_null);
                    }
                });
            };
            this.logs.i("Log file set up with level : " + this.logs.level_str);
        }
    }
    add_stream_to_call(writable_stream) {
        if (!this._thrs_strms) {
            this._thrs_strms = [writable_stream];
        }
        else {
            this._thrs_strms.push(writable_stream);
        }
    }
    //
    // === FILE ===
    get file_path() {
        return __classPrivateFieldGet(this, __f_p);
    }
    set file_path(file_path) {
        {
            //
            // Remove forbidden characters from file_path
            {
                const formatted = file_path.match(/[^:\*\?"<>\|]/g).join("");
                __classPrivateFieldSet(this, __f_p, formatted);
                console.log("Logger#set file_path Path set : " + formatted);
            }
        }
        {
            fs_extra.ensureFileSync(__classPrivateFieldGet(this, __f_p));
            fs_extra.open(__classPrivateFieldGet(this, __f_p), "a", //append
            (err, fd) => {
                // If the output file does not exists
                // an error is thrown else data in the
                // buffer is written to the output file
                if (err) {
                    return console.error("Logger#set file_path::open Can't open file " + __classPrivateFieldGet(this, __f_p) +
                        " : " +
                        err);
                }
                this.file_desc = fd;
            });
        }
    }
}
__f_p = new WeakMap();
//# sourceMappingURL=Logger_props.js.map