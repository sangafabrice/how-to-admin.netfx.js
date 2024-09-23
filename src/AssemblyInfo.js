@set @MAJOR = 0
@set @MINOR = 0
@set @BUILD = 1
@set @REVISION = 0

import Microsoft.JScript;
import System;
import System.IO;
import System.Diagnostics;
import System.Runtime.InteropServices;
import System.Reflection;
import System.Windows;
import System.Text;
import Microsoft.Win32;
import Microsoft.VisualBasic;
import IWshRuntimeLibrary;

[assembly: AssemblyProduct('CvMd2Html Shortcut')]
[assembly: AssemblyCopyright('\u00A9 2024 sangafabrice')]
[assembly: AssemblyCompany('sangafabrice')]
[assembly: AssemblyTitle('CvMd2Html')]
[assembly: AssemblyInformationalVersion(@MAJOR + '.' + @MINOR + '.' + @BUILD + '.' + @REVISION)]
[assembly: AssemblyVersion(@MAJOR + '.' + @MINOR + '.' + @BUILD + '.' + @REVISION)]