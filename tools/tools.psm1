<#PSScriptInfo .VERSION 1.0.1#>

Get-Item "$PSScriptRoot\*.ps1" | ForEach-Object { New-Item -Path "Function:\" -Name $_.BaseName -Value (Get-Content $_.FullName -Raw) }
Export-ModuleMember -Function *
$MyInvocation.MyCommand.ScriptBlock.Module.OnRemove = {
  if ($(($ResourceFiles = @((Get-Item "$PSScriptRoot\..\bin\*.res").FullName))).Count) {
    Remove-Item $ResourceFiles -ErrorAction SilentlyContinue
  }
}