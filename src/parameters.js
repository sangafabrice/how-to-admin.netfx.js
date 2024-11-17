/**
 * @file returns the parsed parameters.
 * @version 0.0.1.1
 */

/**
 * The parameters and arguments.
 * @typedef {object} Param
 * @property {string} Markdown is the selected markdown file path.
 * @property {boolean} Set installs the shortcut menu.
 * @property {boolean} NoIcon installs the shortcut menu without icon.
 * @property {boolean} Unset uninstalls the shortcut menu.
 * @property {boolean} Help shows help.
 */

var Param = (function (args) {
  if (args.length == 1) {
    var arg = args[0].Trim();
    var paramName = arg.split(':', 1)[0].toLowerCase();
    if (paramName == '/markdown') {
      var paramMarkdown = arg.replace(new RegExp('^' + paramName + ':?', 'i'), '');
      if (paramMarkdown.length > 0) {
        return {
          Markdown: paramMarkdown
        }
      }
    }
    switch (arg.toLowerCase()) {
      case '/set':
        return {
          Set: true,
          NoIcon: false
        }
      case '/set:noicon':
        return {
          Set: true,
          NoIcon: true
        }
      case '/unset':
        return {
          Unset: true
        }
      default:
        return {
          Markdown: arg
        }
    }
  } else if (args.length == 0) {
    return {
      Set: true,
      NoIcon: false
    }
  }
  Popup(
    new StringBuilder()
    .AppendLine('The MarkdownToHtml shortcut launcher.')
    .AppendLine('It starts the shortcut menu target script in a hidden window.')
    .AppendLine()
    .AppendLine('Syntax:')
    .AppendLine('  Convert-MarkdownToHtml [/Markdown:]<markdown file path>')
    .AppendLine('  Convert-MarkdownToHtml [/Set[:NoIcon]]')
    .AppendLine('  Convert-MarkdownToHtml /Unset')
    .AppendLine('  Convert-MarkdownToHtml /Help')
    .AppendLine()
    .AppendLine("<markdown file path>  The selected markdown's file path.")
    .AppendLine('                 Set  Configure the shortcut menu in the registry.')
    .AppendLine('              NoIcon  Specifies that the icon is not configured.')
    .AppendLine('               Unset  Removes the shortcut menu.')
    .AppendLine('                Help  Show the help doc.')
    .ToString()
  );
  Quit(1);
})(CommandLineArguments);