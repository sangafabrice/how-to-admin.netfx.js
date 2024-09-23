/**
 * @file Launches the shortcut target PowerShell script with the selected markdown as an argument.
 * @version 0.0.1.0
 */

RequestAdminPrivileges()

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
  var watcher = GetObject('winmgmts:').ExecNotificationQuery(wqlQuery);
  var cmdProcess = watcher.NextEvent();
  try {
    return cmdProcess.ExitStatus;
  } finally {
    Marshal.FinalReleaseComObject(cmdProcess);
    Marshal.FinalReleaseComObject(watcher);
    watcher = null;
    cmdProcess = null;
  }
}

/** Request administrator privileges if standard user. */
function RequestAdminPrivileges() {
  if (IsCurrentProcessElevated()) return;
  var shell = new ActiveXObject('Shell.Application');
  shell.ShellExecute(AssemblyLocation, Interaction.Command(), Missing.Value, 'runas', Constants.vbHidden);
  Marshal.FinalReleaseComObject(shell);
  shell = null;
  Quit(0);
}

/**
 * Check if the process is elevated.
 * @returns {boolean} True if the running process is elevated, false otherwise.
 */
function IsCurrentProcessElevated() {
  var HKU = 0x80000003;
  var stdRegProvMethods = StdRegProv.Methods_;
  var checkAccessMethod = stdRegProvMethods.Item('CheckAccess');
  var checkAccessMethodParams = checkAccessMethod.InParameters;
  var inParams = checkAccessMethodParams.SpawnInstance_();
  inParams.hDefKey = Convert.ToInt32(HKU);
  inParams.sSubKeyName = 'S-1-5-19\\Environment';
  var outParams = StdRegProv.ExecMethod_(checkAccessMethod.Name, inParams);
  try {
    return outParams.bGranted;
  } finally {
    Marshal.FinalReleaseComObject(outParams);
    Marshal.FinalReleaseComObject(inParams);
    Marshal.FinalReleaseComObject(checkAccessMethodParams);
    Marshal.FinalReleaseComObject(checkAccessMethod);
    Marshal.FinalReleaseComObject(stdRegProvMethods);
    stdRegProvMethods = null;
    checkAccessMethod = null;
    checkAccessMethodParams = null;
    inParams = null;
    outParams = null;
  }
}