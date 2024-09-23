/**
 * @file some utility functions.
 * @version 0.0.1.0
 */

var AssemblyLocation = Assembly.GetExecutingAssembly().Location;

/** @typedef {object} StdRegProv */
var StdRegProv = GetObject('winmgmts:StdRegProv');

/**
 * Generate a random file path.
 * @param {string} extension is the file extension.
 * @returns a random file path.
 */
function GenerateRandomPath(extension) {
  return Path.Combine(Path.GetTempPath(), Guid.NewGuid() + '.tmp' + extension);
}

/**
 * Delete the specified file.
 * @param {string} filePath is the file path.
 */
function DeleteFile(filePath) {
  try {
    File.Delete(filePath);
  } catch (e) { }
}

/**
 * Show the application message box.
 * @param {string} messageText is the message text to show.
 * @param {MessageBoxImage} popupType is the type of popup box.
 * @param {MessageBoxButton} popupButtons are the buttons of the message box.
 */
function Popup(messageText, popupType, popupButtons) {
  if (!popupType) {
    popupType = MessageBoxImage.None;
  }
  if (!popupButtons) {
    popupButtons = MessageBoxButton.OK;
  }
  MessageBox.Show(messageText, "Convert to HTML", MessageBoxButton(popupButtons), MessageBoxImage(popupType));
}

/** Destroy the COM objects. */
function Dispose() {
  Marshal.FinalReleaseComObject(StdRegProv);
  StdRegProv = null;
}

/**
 * Clean up and quit.
 * @param {int} exitCode .
 */
function Quit(exitCode) {
  Dispose();
  CollectGarbage();
  Environment.Exit(exitCode);
}