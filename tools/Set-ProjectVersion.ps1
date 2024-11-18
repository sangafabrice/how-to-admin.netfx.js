<#PSScriptInfo .VERSION 1.0.2#>

[CmdletBinding()]
param ([string] $Root)

git add *.js *.ps*1 cvmd2html.rc version.h

& {
  # Set the version of the executable
  $versionHeader = 'version.h'
  $versionHeaderPath = "$Root\$versionHeader"
  $diffLines = git diff HEAD *.js cvmd2html.rc
  if ($null -ne $diffLines) {
    $diff = ($diffLines | ForEach-Object { switch ($_[0]) { "+"{1} "-" {-1} } } | Measure-Object -Sum).Sum
    $version = ([int](@(git cat-file -p HEAD:$versionHeader)[0] -split ',')[-1]) + ($diff -eq 0 ? 1:[Math]::Abs($diff))
    $versionHeaderContent = (Get-Content $versionHeaderPath -Raw) -replace '((\d+,){3})\d+',"`${1}$version" -replace '((\d+\.){3})\d+',"`${1}$version"
    $versionHeaderContent | Out-File $versionHeaderPath -NoNewline
  }
}

function Set-SourceVersion([string] $ExtensionPattern, [string] $Filter, [scriptblock] $VersionGetter, [string] $VersionMatch, [string] $ReplacementFormat) {
  # Set the version of the source files
  git status -s $ExtensionPattern | ConvertFrom-StringData -Delimiter ' ' | Where-Object { $_.Keys[0].EndsWith('M') } | ForEach-Object { $_.Values } | Where-Object { $_ -ne $Filter } |
  ForEach-Object {
    $version = git cat-file -p HEAD:$_ 2>&1 | Select-Object -First 4 | Where-Object { $_ -match $VersionMatch } | ForEach-Object $VersionGetter | Select-Object -Last 1
    if (-not [String]::IsNullOrWhiteSpace($version)) {
      $content = (Get-Content $_ -Raw) -replace $VersionMatch,($ReplacementFormat -f $version)
      $bytes = Get-Content $_ -AsByteStream -ReadCount 3 -TotalCount 3
      $content | Out-File "$Root\$_" -Encoding ($bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF ? 'utf8BOM':'utf8') -NoNewline
    }
  }
}

Set-SourceVersion *.js 'src/AssemblyInfo.js' { ([version]$_.TrimEnd().Substring(' * @version '.Length)).Revision + 1 } '@version (\d+(\.\d+){2})(\.\d+)?' "@version `$1.{0}"
Set-SourceVersion *.ps*1 'rsc/*.ps1' { ([version]($_.TrimEnd().Substring('<#PSScriptInfo .VERSION '.Length) -split '#')[0]).Build + 1 } '<#PSScriptInfo .VERSION ((\d+\.){2})\d+#>' "<#PSScriptInfo .VERSION `${{1}}{0}#>"
Set-SourceVersion *.rc '' { ([version]$_.TrimEnd().Substring('// @version '.Length)).Revision + 1 } '@version (\d+(\.\d+){2})(\.\d+)?' "@version `$1.{0}"