/**
 * @file Launches the shortcut target PowerShell script with the selected markdown as an argument.
 * @version 0.0.1.6
 */

/** The application execution. */
if (Param.Markdown) {
  var CMD_EXE = 'C:\\Windows\\System32\\cmd.exe';
  var CMD_LINE_FORMAT = '/d /c ""{0}" 2> "{1}""';
  Package.IconLink.Create(Param.Markdown);
  var startInfo = new ProcessStartInfo(CMD_EXE, String.Format(CMD_LINE_FORMAT, Package.IconLink.Path, ErrorLog.Path));
  startInfo.WindowStyle = ProcessWindowStyle.Hidden;
  if (WaitForExit(Process.Start(ProcessStartInfo(startInfo)).Id)) {
    with (ErrorLog) {
      Read();
      Delete();
    }
  }
  Package.IconLink.Delete();
  Quit(0);
}

/** Configuration and settings. */
if (Param.Set ^ Param.Unset) {
  if (Param.Set) {
    Setup.Set();
    if (Param.NoIcon) {
      Setup.RemoveIcon();
    } else {
      Setup.AddIcon();
    }
  } else if (Param.Unset) {
    Setup.Unset();
  }
  Quit(0);
}

Quit(1);

/**
 * Wait for the process exit.
 * @param {int} processId is the process identifier.
 * @returns {int} the exit status of the process.
 */
function WaitForExit(processId) {
  // The process termination event query. Win32_ProcessStopTrace requires admin rights to be used.
  var wqlQuery = "SELECT * FROM Win32_ProcessStopTrace WHERE ProcessName='cmd.exe' AND ProcessId=" + processId;
  // Wait for the process to exit.
  return (new ManagementEventWatcher(wqlQuery)).WaitForNextEvent()['ExitStatus'];
}