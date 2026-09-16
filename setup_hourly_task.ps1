$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-ExecutionPolicy Bypass -WindowStyle Hidden -File D:\Lens\Dashboard\hourly_update_and_publish.ps1" -WorkingDirectory "D:\Lens\Dashboard"
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).Date.AddMinutes(10) -RepetitionInterval (New-TimeSpan -Hours 1)
Register-ScheduledTask -TaskName "51Talk_Dashboard_Hourly_Update" -Action $action -Trigger $trigger -Description "Hourly Big Team 01 Dashboard data update and GitHub Pages sync at 10 minutes past every hour." -Force
