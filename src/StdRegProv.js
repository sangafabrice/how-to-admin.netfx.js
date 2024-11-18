/**
 * @file StdRegProv WMI class as inspired by mgmclassgen.exe.
 * @version 0.0.1.1
 */

import System;
import System.Diagnostics;
import System.Management;

package ROOT.CIMV2 {

  abstract class StdRegProv {

    private static var CreatedClassName: String = GetTypeName();

    static function CheckAccess(hDefKey: uint, sSubKeyName: String): Boolean {
      var methodName: String = GetMethodName(new StackTrace());
      var classObj: ManagementClass = new ManagementClass(CreatedClassName);
      var inParams: ManagementBaseObject = classObj.GetMethodParameters(methodName);
      inParams['hDefKey'] = hDefKey;
      inParams['sSubKeyName'] = sSubKeyName;
      return classObj.InvokeMethod(methodName, inParams, null)['bGranted'];
    }

    static function CreateKey(hDefKey: uint, sSubKeyName: String): uint {
      var methodName: String = GetMethodName(new StackTrace());
      var classObj: ManagementClass = new ManagementClass(CreatedClassName);
      var inParams: ManagementBaseObject = classObj.GetMethodParameters(methodName);
      inParams['hDefKey'] = hDefKey;
      inParams['sSubKeyName'] = sSubKeyName;
      return classObj.InvokeMethod(methodName, inParams, null)['ReturnValue'];
    }

    static function DeleteKey(hDefKey: uint, sSubKeyName: String): uint {
      var methodName: String = GetMethodName(new StackTrace());
      var classObj: ManagementClass = new ManagementClass(CreatedClassName);
      var inParams: ManagementBaseObject = classObj.GetMethodParameters(methodName);
      inParams['hDefKey'] = hDefKey;
      inParams['sSubKeyName'] = sSubKeyName;
      return classObj.InvokeMethod(methodName, inParams, null)['ReturnValue'];
    }

    static function DeleteValue(hDefKey: uint, sSubKeyName: String, sValueName: String): uint {
      var methodName: String = GetMethodName(new StackTrace());
      var classObj: ManagementClass = new ManagementClass(CreatedClassName);
      var inParams: ManagementBaseObject = classObj.GetMethodParameters(methodName);
      inParams['hDefKey'] = hDefKey;
      inParams['sSubKeyName'] = sSubKeyName;
      inParams['sValueName'] = sValueName;
      return classObj.InvokeMethod(methodName, inParams, null)['ReturnValue'];
    }

    static function EnumKey(hDefKey: uint, sSubKeyName: String): String[] {
      var methodName: String = GetMethodName(new StackTrace());
      var classObj: ManagementClass = new ManagementClass(CreatedClassName);
      var inParams: ManagementBaseObject = classObj.GetMethodParameters(methodName);
      inParams['hDefKey'] = hDefKey;
      inParams['sSubKeyName'] = sSubKeyName;
      return classObj.InvokeMethod(methodName, inParams, null)['sNames'];
    }

    static function GetStringValue(hDefKey: uint, sSubKeyName: String, sValueName: String): String {
      var methodName: String = GetMethodName(new StackTrace());
      var classObj: ManagementClass = new ManagementClass(CreatedClassName);
      var inParams: ManagementBaseObject = classObj.GetMethodParameters(methodName);
      if (hDefKey) {
        inParams['hDefKey'] = hDefKey;
      }
      inParams['sSubKeyName'] = sSubKeyName;
      inParams['sValueName'] = sValueName;
      return classObj.InvokeMethod(methodName, inParams, null)['sValue'];
    }

    static function SetStringValue(hDefKey: uint, sSubKeyName: String, sValueName: String, sValue: String): uint {
      var methodName: String = GetMethodName(new StackTrace());
      var classObj: ManagementClass = new ManagementClass(CreatedClassName);
      var inParams: ManagementBaseObject = classObj.GetMethodParameters(methodName);
      inParams['hDefKey'] = hDefKey;
      inParams['sSubKeyName'] = sSubKeyName;
      inParams['sValueName'] = sValueName;
      inParams['sValue'] = sValue;
      return classObj.InvokeMethod(methodName, inParams, null)['ReturnValue'];
    }

    /**
     * Remove the key and all descendant subkeys.
     * @borrows DeleteKey as DeleteKeyTree
     */
    static function DeleteKeyTree(hDefKey: uint, sSubKeyName: String): uint {
      var returnValue: uint = 0;
      var sNames = EnumKey(hDefKey, sSubKeyName);
      if (sNames != null) {
        for (var index = 0; index < sNames.length; index++) {
          returnValue += DeleteKeyTree(hDefKey, sSubKeyName + '\\' + sNames[index]);
        }
      }
      return (returnValue += DeleteKey(hDefKey, sSubKeyName));
    }

    /**
     * Get the name of the method calling this method.
     * @param stackTrace is the stack trace from the calling method.
     * @returns the name of the caller method.
     */
    private static function GetMethodName(stackTrace: StackTrace): String {
      return stackTrace.GetFrame(0).GetMethod().Name;
    }

    /** Return the created class name. */
    private static function GetTypeName(): String {
      return new StackTrace().GetFrame(0).GetMethod().DeclaringType.Name;
    }
  }
}