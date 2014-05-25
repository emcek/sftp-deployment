function MessageObserver() {
}

var createMessage = function(message, file, classes) {
  var atomModule = require('atom');
  var $ = atomModule.$;
  var md5 = require('MD5');

  var workspace = $(".workspace");
  var sftpMessages = workspace.find(".sftp-messages ul");
  if (sftpMessages.length === 0) {
    $('.workspace').append('<div class="sftp-messages"><ul></ul></div>');
    sftpMessages = workspace.find(".sftp-messages ul");
  }

  sftpMessages.append('<li id="'+md5(file)+'" class="message '+classes+'">'+message+'</li>');

  setTimeout(function() {
    var message = $("#"+md5(file));
    var messages = $(".sftp-messages ul").children('.message');
    message.remove();
    if (sftpMessages.find('.message').length === 0) {
      sftpMessages.parent().remove();
    }
  }, 3000);
};

var createErrorMessage = function(message, file) {
  createMessage(message, file, 'error');
};

var createWarningMessage = function(message, file) {
  createMessage(message, file, 'warning');
};

var createSuccessMessage = function(message, file) {
  createMessage(message, file, 'success');
};

MessageObserver.prototype.notify = function(value, data) {
  switch (value) {
    case "configuration_file_doesnt_exist":
      createErrorMessage("The configuration file doesn't exist", data.filename);
      break;
    case "connection_error":
      createErrorMessage("The connection has encountered an error.", value);
      break;
    case "sftp_upload_file_error":
      createErrorMessage("Upload of " + data + " fail", data);
      break;
    case "sftp_upload_file_success":
      createSuccessMessage("Upload of " + data + " success", data);
      break;
    default:
      break;
  }
};

module.exports = MessageObserver;