/**
 * Set the specified error msg relative to the specified field
 * to the right places in HTML
 * @param {string} field
 * @param {string} msg
 */
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
}
