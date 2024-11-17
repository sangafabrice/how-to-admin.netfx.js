<#PSScriptInfo .VERSION 1.0.1#>

[CmdletBinding()]
param ([string[]] $LiteralPath)
Get-ChildItem $LiteralPath -Recurse | ForEach-Object {
  $content = @(Get-Content $_.FullName).TrimEnd() -join [Environment]::NewLine
  $bytes = Get-Content $_.FullName -AsByteStream -ReadCount 3 -TotalCount 3
  $content | Out-File $_.FullName -Encoding ($bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF ? 'utf8BOM':'utf8') -NoNewline
}