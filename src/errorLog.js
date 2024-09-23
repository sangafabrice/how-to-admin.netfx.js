/**
 * @file manages the error log file and content.
 * @version 0.0.1.0
 */

/** @typedef */
var ErrorLog = {
  Path: GenerateRandomPath('.log'),

  /** Display the content of the error log file in a message box. */
  Read: function () {
    try {
      var txtStream = File.OpenText(this.Path);
      // Read the error message and remove the ANSI escaped character for red coloring.
      var errorMessage = txtStream.ReadToEnd().replace(/(\x1B\[31;1m)|(\x1B\[0m)/g, '');
      if (errorMessage.length) {
        Popup(errorMessage, MessageBoxImage.Error);
      }
    } catch (e) { }
    if (txtStream) {
      txtStream.Close();
      txtStream.Dispose();
    }
  },

  /** Delete the error log file. */
  Delete: function () {
    DeleteFile(this.Path);
  }
}