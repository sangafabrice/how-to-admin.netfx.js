/**
 * @file the methods for managing the shortcut menu option: install and uninstall.
 * @version 0.0.1.0
 */

/** @typedef {object} Setup */

var Setup = (function() {
  var SHELL_SUBKEY = 'SOFTWARE\\Classes\\SystemFileAssociations\\.md\\shell';
  var VERB = 'cthtml';
  var VERB_SUBKEY = String.Format('{0}\\{1}', SHELL_SUBKEY, VERB);
  var VERB_KEY = String.Format('{0}\\{1}', Registry.CurrentUser, VERB_SUBKEY);
  var ICON_VALUENAME = 'Icon';

  return {
    /** Configure the shortcut menu in the registry. */
    Set: function () {
      var COMMAND_KEY = VERB_KEY + '\\command';
      var command = String.Format('"{0}" /Markdown:"%1"', AssemblyLocation);
      Registry.SetValue(COMMAND_KEY, null, command);
      Registry.SetValue(VERB_KEY, null, 'Convert to &HTML');
    },

    /** Add an icon to the shortcut menu in the registry. */
    AddIcon: function () {
      Registry.SetValue(VERB_KEY, ICON_VALUENAME, Package.MenuIconPath);
    },

    /** Remove the shortcut icon menu. */
    RemoveIcon: function () {
      var VERB_KEY_OBJ = Registry.CurrentUser.OpenSubKey(VERB_SUBKEY, true);
      if (VERB_KEY_OBJ) {
        VERB_KEY_OBJ.DeleteValue(ICON_VALUENAME, false);
        VERB_KEY_OBJ.Dispose();
        VERB_KEY_OBJ = null;
      }
    },

    /** Remove the shortcut menu by removing the verb key and subkeys. */
    Unset: function () {
      var SHELL_KEY_OBJ = Registry.CurrentUser.OpenSubKey(SHELL_SUBKEY, true);
      if (SHELL_KEY_OBJ) {
        SHELL_KEY_OBJ.DeleteSubKeyTree(VERB, false);
        SHELL_KEY_OBJ.Dispose();
        SHELL_KEY_OBJ = null;
      }
    }
  }
})();