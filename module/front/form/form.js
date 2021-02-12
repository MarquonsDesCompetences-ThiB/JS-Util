import $ from "jquery";
/**
 * Set the specified error msg relative to the specified field
 * to the right places in HTML
 * @param {string} field
 * @param {string} msg
 *
function set_form_error(form_prefix, field, msg) {
  //
  // Add message in errors zone
  const p = $("<p>" + msg + "</p>");
  p.appendTo(regi_errors);

  //
  // Red color the form field zone
  let form_div = $("#" + form_prefix + field);
  form_div.addClass("error");

  //
  //Add message under field
  let msg_div = form_div.children(".msg")[0];
  msg_div.innerHTML = "";
  msg_div.append(msg);
}*/
function set_errors(errs, all_msgs_zone) {
    for (const module in errs) {
        for (const input in errs[module]) {
            let field_zone = $("#" + module + input);
            const msg = errs[module][input];
            //
            // Red color the concerned field zone
            {
                field_zone.addClass("error");
            }
            //
            //Add message under field
            {
                let msg_zone = field_zone.find(".msg")[0];
                msg_zone.innerHTML = "";
                msg_zone.append(msg);
            }
            //
            // Add message in all msgs zone
            {
                const p = $("<p>" + msg + "</p>");
                p.appendTo(all_msgs_zone);
            }
        }
    }
}
//# sourceMappingURL=form.js.map