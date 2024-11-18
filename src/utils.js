/**
 * @file some utility functions.
 * @version 0.0.1.3
 */

var CommandLineArguments = Convert.ToNativeArray(Environment.GetCommandLineArgs(), Type.GetTypeHandle(new String())).slice(1);

var AssemblyLocation = Assembly.GetExecutingAssembly().Location;

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

/**
 * Clean up and quit.
 * @param {int} exitCode .
 */
function Quit(exitCode) {
  CollectGarbage();
  Environment.Exit(exitCode);
}