<#PSScriptInfo .VERSION 1.0.1#>

[CmdletBinding()]
param ([string] $Root)

git add *.js *.ps*1 cvmd2html.rc version.h

& {
  # Set the version of the executable
  $versionHeaderPath = "$Root\version.h"
  $diffLines = git diff HEAD *.js cvmd2html.rc
  if ($null -ne $diffLines) {
    $diff = ($diffLines | ForEach-Object { switch ($_[0]) { "+"{1} "-" {-1} } } | Measure-Object -Sum).Sum
    $headInfoContent = git cat-file -p HEAD:src/AssemblyInfo.js | Select-Object -First 4
    $versionMajor = [int] $headInfoContent[0].Substring('@set @MAJOR = '.Length).Trim()
    $versionMinor = [int] $headInfoContent[1].Substring('@set @MINOR = '.Length).Trim()
    $versionBuild = [int] $headInfoContent[2].Substring('@set @BUILD = '.Length).Trim()
    $versionRevision = ([int] $headInfoContent[3].Substring('@set @REVISION = '.Length).Trim()) + ($diff -eq 0 ? 1:[Math]::Abs($diff))
@"
#define VER_VERSION $versionMajor,$versionMinor,$versionBuild,$versionRevision
#define VER_VERSION_STR "$versionMajor.$versionMinor.$versionBuild.$versionRevision"
"@ | Out-File $versionHeaderPath
  }
}

function Set-SourceVersion([string] $ExtensionPattern, [string] $Filter, [scriptblock] $VersionGetter, [string] $VersionMatch, [string] $ReplacementFormat) {
  # Set the version of the source files
  git status -s $ExtensionPattern | ConvertFrom-StringData -Delimiter ' ' | Where-Object { $_.Keys[0].EndsWith('M') } | ForEach-Object { $_.Values } | Where-Object { $_ -ne $Filter } |
  ForEach-Object {
    $version = git cat-file -p HEAD:$_ 2>&1 | Select-Object -First 4 | Where-Object { $_ -match $VersionMatch } | ForEach-Object $VersionGetter | Select-Object -Last 1
    if (-not [String]::IsNullOrWhiteSpace($version)) {
      $content = (Get-Content $_ -Raw) -replace $VersionMatch,($ReplacementFormat -f $version)
      Set-Content "$Root\$_" $content -NoNewline
    }
  }
}

Set-SourceVersion *.js 'src/AssemblyInfo.js' { ([version]$_.TrimEnd().Substring(' * @version '.Length)).Revision + 1 } '@version (\d+(\.\d+){2})(\.\d+)?' "@version `$1.{0}"
Set-SourceVersion *.ps*1 'rsc/*.ps1' { ([version]($_.TrimEnd().Substring('<#PSScriptInfo .VERSION '.Length) -split '#')[0]).Build + 1 } '<#PSScriptInfo .VERSION ((\d+\.){2})\d+#>' "<#PSScriptInfo .VERSION `${{1}}{0}#>"
Set-SourceVersion *.rc '' { ([version]$_.TrimEnd().Substring('// @version '.Length)).Revision + 1 } '@version (\d+(\.\d+){2})(\.\d+)?' "@version `$1.{0}"