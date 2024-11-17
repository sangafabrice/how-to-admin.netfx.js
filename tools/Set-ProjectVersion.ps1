<#PSScriptInfo .VERSION 1.0.0#>

[CmdletBinding()]
param ([string] $Root)

git add *.js *.ps*1

& {
  # Set the version of the executable
  $infoFileRelPath = 'src/AssemblyInfo.js'
  $infoFilePath = "$Root\$infoFileRelPath"
  $diffLines = git diff HEAD *.js
  if ($null -ne $diffLines) {
    $revisionMatch = '@set @REVISION = '
    $diff = [Math]::Abs(($diffLines | ForEach-Object { switch ($_[0]) { "+"{1} "-"{-1} } } | Measure-Object -Sum).Sum)
    $version = ($diff -eq 0 ? 1:$diff) + ([int]@(git cat-file -p HEAD:$infoFileRelPath)[3].Substring($revisionMatch.Length).Trim())
    $infoContent =  (Get-Content $infoFilePath -Raw) -replace "($revisionMatch)\d+","`${1}$version"
    $infoContent | Out-File $infoFilePath -Encoding utf8BOM -NoNewline
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