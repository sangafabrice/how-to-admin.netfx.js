/**
 * @file returns information about the resource files used by the project.
 * @version 0.0.1.1
 */

/** @typedef */
var Package = (function() {
  /** @constant {string} */
  var POWERSHELL_SUBKEY = 'HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\pwsh.exe';
  // The project root path
  var root = AppContext.BaseDirectory;
  // The project resources directory path.
  var resourcePath = Path.Combine(root, 'rsc');

  // The powershell core runtime path.
  var pwshExePath = Registry.GetValue(POWERSHELL_SUBKEY, null, null);
  // The shortcut target powershell script path.
  var pwshScriptPath = Path.Combine(resourcePath, 'cvmd2html.ps1');

  return {
    /** @type {string} */
    PwshExePath: pwshExePath,
    /** @type {string} */
    PwshScriptPath: pwshScriptPath,

    /** Represents an adapted link object. */
    IconLink: {
      /** @type {string} */
      Path: GenerateRandomPath('.lnk'),

      /**
       * Create the custom icon link file.
       * @param {string} markdownPath is the input markdown file path.
       */
      Create: function (markdownPath) {
        var shell = new WshShell();
        var link = shell.CreateShortcut(this.Path);
        link.TargetPath = pwshExePath;
        link.Arguments = String.Format('-ep Bypass -nop -w Hidden -f "{0}" -Markdown "{1}"', pwshScriptPath, markdownPath);
        link.IconLocation = AssemblyLocation;
        link.Save();
        Marshal.FinalReleaseComObject(link);
        Marshal.FinalReleaseComObject(shell);
        shell = null;
        link = null;
      },

      /** Delete the custom icon link file. */
      Delete: function () {
        DeleteFile(this.Path);
      }
    }
  }
})();