<#PSScriptInfo .VERSION 1.0.5#>

using namespace System.Management.Automation
[CmdletBinding()]
param ()

& {
  Import-Module "$PSScriptRoot\tools"
  Format-ProjectCode @('*.js','*.ps*1','.gitignore','cvmd2html.rc'| ForEach-Object { "$PSScriptRoot\$_" })

  $HostColorArgs = @{
    ForegroundColor = 'Black'
    BackgroundColor = 'Green'
  }

  try { Remove-Item "$(($BinDir = "$PSScriptRoot\bin"))\*" -Recurse -ErrorAction Stop }
  catch [ItemNotFoundException] { Write-Host $_.Exception.Message @HostColorArgs }
  catch {
    $HostColorArgs.BackgroundColor = 'Red'
    Write-Host $_.Exception.Message @HostColorArgs
    return
  }
  New-Item $BinDir -ItemType Directory -ErrorAction SilentlyContinue | Out-Null
  Copy-Item "$PSScriptRoot\rsc" -Destination $BinDir -Recurse
  Save-ProjectPackage $PSScriptRoot
  Set-ProjectVersion $PSScriptRoot

  # Compile the resource file with rc.exe.
  rc.exe /nologo /fo $(($ResourceFile = "$BinDir\cvmd2html.res")) "$PSScriptRoot\cvmd2html.rc"

  # Compile the source code with jsc.exe.
  $EnvPath = $Env:Path
  $Env:Path = "$Env:windir\Microsoft.NET\Framework$(If ([Environment]::Is64BitOperatingSystem) { '64' })\v4.0.30319\;$Env:Path"
  jsc.exe /nologo /target:$($DebugPreference -eq 'Continue' ? 'exe':'winexe') /win32res:$ResourceFile /warn:0 /reference:"$BinDir\Interop.IWshRuntimeLibrary.dll" /reference:$(Get-WpfLibrary PresentationFramework) /reference:$(Get-WpfLibrary PresentationCore) /reference:$(Get-WpfLibrary WindowsBase) /reference:System.Xaml.dll /out:$(($ConvertExe = "$BinDir\cvmd2html.exe")) "$(($SrcDir = "$PSScriptRoot\src"))\AssemblyInfo.js" "$SrcDir\utils.js" "$SrcDir\parameters.js" "$SrcDir\errorLog.js" "$SrcDir\package.js" "$SrcDir\setup.js" "$PSScriptRoot\index.js"
  $Env:Path = $EnvPath

  if ($LASTEXITCODE -eq 0) {
    Write-Host "Output file $ConvertExe written." @HostColorArgs -NoNewline
    Format-ExecutableInfo $ConvertExe
  }

  Remove-Module tools
}