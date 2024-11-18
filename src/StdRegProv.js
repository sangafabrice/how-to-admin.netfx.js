/**
 * @file StdRegProv WMI class as inspired by mgmclassgen.exe.
 * @version 0.0.1.0
 */

import System;
import System.Diagnostics;
import System.Runtime.InteropServices;
import WbemScripting;

package ROOT.CIMV2 {

  abstract class StdRegProv {

    private static var CreatedClassName: String = GetTypeName();

    static function CheckAccess(hDefKey: uint, sSubKeyName: String): Boolean {
      var methodName: String = GetMethodName(new StackTrace());
      var Registry = new StdRegProvider();
      var Input = new StdRegInput(Registry.Provider, methodName);
      SetWBemObjectProperty(Input.Params, 'hDefKey', int(hDefKey));
      SetWBemObjectProperty(Input.Params, 'sSubKeyName', sSubKeyName);
      var outParams: SWbemObject = Registry.Provider.ExecMethod_(methodName, Input.Params);
      try {
        return GetWBemObjectProperty(outParams, 'bGranted');
      }
      finally {
        Marshal.FinalReleaseComObject(outParams);
        outParams = null;
        Input.Dispose();
        Registry.Dispose();
      }
    }

    static function CreateKey(hDefKey: uint, sSubKeyName: String): uint {
      var methodName: String = GetMethodName(new StackTrace());
      var Registry = new StdRegProvider();
      var Input = new StdRegInput(Registry.Provider, methodName);
      SetWBemObjectProperty(Input.Params, 'hDefKey', int(hDefKey));
      SetWBemObjectProperty(Input.Params, 'sSubKeyName', sSubKeyName);
      var outParams: SWbemObject = Registry.Provider.ExecMethod_(methodName, Input.Params);
      try {
        return GetWBemObjectProperty(outParams, 'ReturnValue');
      }
      finally {
        Marshal.FinalReleaseComObject(outParams);
        outParams = null;
        Input.Dispose();
        Registry.Dispose();
      }
    }

    static function DeleteKey(hDefKey: uint, sSubKeyName: String): uint {
      var methodName: String = GetMethodName(new StackTrace());
      var Registry = new StdRegProvider();
      var Input = new StdRegInput(Registry.Provider, methodName);
      SetWBemObjectProperty(Input.Params, 'hDefKey', int(hDefKey));
      SetWBemObjectProperty(Input.Params, 'sSubKeyName', sSubKeyName);
      var outParams: SWbemObject = Registry.Provider.ExecMethod_(methodName, Input.Params);
      try {
        return GetWBemObjectProperty(outParams, 'ReturnValue');
      }
      finally {
        Marshal.FinalReleaseComObject(outParams);
        outParams = null;
        Input.Dispose();
        Registry.Dispose();
      }
    }

    static function DeleteValue(hDefKey: uint, sSubKeyName: String, sValueName: String): uint {
      var methodName: String = GetMethodName(new StackTrace());
      var Registry = new StdRegProvider();
      var Input = new StdRegInput(Registry.Provider, methodName);
      SetWBemObjectProperty(Input.Params, 'hDefKey', int(hDefKey));
      SetWBemObjectProperty(Input.Params, 'sSubKeyName', sSubKeyName);
      SetWBemObjectProperty(Input.Params, 'sValueName', sValueName);
      var outParams: SWbemObject = Registry.Provider.ExecMethod_(methodName, Input.Params);
      try {
        return GetWBemObjectProperty(outParams, 'ReturnValue');
      }
      finally {
        Marshal.FinalReleaseComObject(outParams);
        outParams = null;
        Input.Dispose();
        Registry.Dispose();
      }
    }

    static function EnumKey(hDefKey: uint, sSubKeyName: String): String[] {
      var methodName: String = GetMethodName(new StackTrace());
      var Registry = new StdRegProvider();
      var Input = new StdRegInput(Registry.Provider, methodName);
      SetWBemObjectProperty(Input.Params, 'hDefKey', int(hDefKey));
      SetWBemObjectProperty(Input.Params, 'sSubKeyName', sSubKeyName);
      var outParams: SWbemObject = Registry.Provider.ExecMethod_(methodName, Input.Params);
      try {
        var sNames = GetWBemObjectProperty(outParams, 'sNames');
        if (sNames == null) {
          return null;
        }
        var sNameStr: String[] = new String[sNames.length];
        for (var index = 0; index < sNames.length; index++) {
          sNameStr[index] = sNames[index];
        }
        return sNameStr;
      }
      finally {
        Marshal.FinalReleaseComObject(outParams);
        outParams = null;
        Input.Dispose();
        Registry.Dispose();
      }
    }

    static function GetStringValue(hDefKey: uint, sSubKeyName: String, sValueName: String): String {
      var methodName: String = GetMethodName(new StackTrace());
      var Registry = new StdRegProvider();
      var Input = new StdRegInput(Registry.Provider, methodName);
      if (hDefKey) {
        SetWBemObjectProperty(Input.Params, 'hDefKey', int(hDefKey));
      }
      SetWBemObjectProperty(Input.Params, 'sSubKeyName', sSubKeyName);
      SetWBemObjectProperty(Input.Params, 'sValueName', sValueName);
      var outParams: SWbemObject = Registry.Provider.ExecMethod_(methodName, Input.Params);
      try {
        return GetWBemObjectProperty(outParams, 'sValue');
      }
      finally {
        Marshal.FinalReleaseComObject(outParams);
        outParams = null;
        Input.Dispose();
        Registry.Dispose();
      }
    }

    static function SetStringValue(hDefKey: uint, sSubKeyName: String, sValueName: String, sValue: String): uint {
      var methodName: String = GetMethodName(new StackTrace());
      var Registry = new StdRegProvider();
      var Input = new StdRegInput(Registry.Provider, methodName);
      SetWBemObjectProperty(Input.Params, 'hDefKey', int(hDefKey));
      SetWBemObjectProperty(Input.Params, 'sSubKeyName', sSubKeyName);
      SetWBemObjectProperty(Input.Params, 'sValueName', sValueName);
      SetWBemObjectProperty(Input.Params, 'sValue', sValue);
      var outParams: SWbemObject = Registry.Provider.ExecMethod_(methodName, Input.Params);
      try {
        return GetWBemObjectProperty(outParams, 'ReturnValue');
      }
      finally {
        Marshal.FinalReleaseComObject(outParams);
        outParams = null;
        Input.Dispose();
        Registry.Dispose();
      }
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

    private static class StdRegInput implements IDisposable {
      var wbemMethodSet: SWbemMethodSet;
      var wbemMethod: SWbemMethod;
      var inParamsClass: SWbemObject;
      internal var Params: SWbemObject;

      internal function StdRegInput(classObj: SWbemObject, methodName: String) {
        wbemMethodSet = classObj.Methods_;
        wbemMethod = wbemMethodSet.Item(methodName);
        inParamsClass = wbemMethod.InParameters;
        Params = inParamsClass.SpawnInstance_();
        classObj = null;
      }

      public function Dispose() {
        Marshal.FinalReleaseComObject(Params);
        Marshal.FinalReleaseComObject(inParamsClass);
        Marshal.FinalReleaseComObject(wbemMethod);
        Marshal.FinalReleaseComObject(wbemMethodSet);
        wbemMethodSet = null;
        wbemMethod = null;
        inParamsClass = null;
        Params = null;
      }
    }

    private static class StdRegProvider implements IDisposable {
      var wbemLocator = new SWbemLocator();
      var wbemService: SWbemServices;
      internal var Provider: SWbemObject;

      internal function StdRegProvider() {
        wbemService = wbemLocator.ConnectServer();
        Provider = wbemService.Get(CreatedClassName);
      }

      public function Dispose() {
        Marshal.FinalReleaseComObject(Provider);
        Marshal.FinalReleaseComObject(wbemService);
        Marshal.FinalReleaseComObject(wbemLocator);
        wbemLocator = null;
        wbemService = null;
        Provider = null;
      }
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

    /**
     * Set the specified property of a SWbemObject instance.
     * @param {SWbemObject} inParams the object to set the property value from.
     * @param {string} propertyName the property name.
     * @param {object} propertyValue the property value.
     */
    private static function SetWBemObjectProperty(inParams, propertyName, propertyValue) {
      var inProperties = inParams.Properties_;
      var property = inProperties.Item(propertyName);
      property.Value = propertyValue;
      Marshal.ReleaseComObject(property);
      Marshal.ReleaseComObject(inProperties);
      inProperties = null;
      property = null;
      inParams = null;
    }

    /**
     * Get the specified property of a SWbemObject instance.
     * @param {SWbemObject} inParams the object to get the property value from.
     * @param {string} propertyName the property name.
     * @returns {object} the property value.
     */
    private static function GetWBemObjectProperty(outParams, propertyName) {
      var outProperties = outParams.Properties_;
      var property = outProperties.Item(propertyName);
      try {
        return property.Value;
      }
      finally {
        Marshal.ReleaseComObject(property);
        Marshal.ReleaseComObject(outProperties);
        Marshal.ReleaseComObject(outParams);
        outParams = null;
        outProperties = null;
        property = null;
      }
    }
  }
}