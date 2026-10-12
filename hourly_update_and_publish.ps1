# =========================================================================
# 51Talk Dashboard Hourly Scheduled Updater & Git Publisher v2.0
# Trigger: Every hour at :10 (10 minutes past the hour)
# Uses single unified update_dashboard.ps1 instead of 3 separate scripts
# =========================================================================

$ErrorActionPreference = "Continue"
$workDir = "D:\Lens\Dashboard"
$logFile = "$workDir\hourly_update.log"
Function Write-Log([string]$msg) {
    $now = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $entry = "[$now] $msg"
    Write-Host $entry
    Add-Content -Path $logFile -Value $entry
}

Write-Log "=========================================================="
Write-Log "Starting Hourly Scheduled Dashboard Update v2.0 (:10 past hour)"

# Step 1: Run fresh download from 51Talk Data Center
try {
    Write-Log "Step 1: Running automated download..."
    & powershell -ExecutionPolicy Bypass -File "$workDir\auto_download_and_process.ps1" | Out-Null
    Write-Log "Download routine triggered successfully."
} catch {
    Write-Log "Error in auto-download: $_"
}

# Step 2: Run unified update (sales + operations + leads + git deploy)
try {
    Write-Log "Step 2: Running unified dashboard update..."
    & powershell -ExecutionPolicy Bypass -File "$workDir\update_dashboard.ps1" | Out-Null
    Write-Log "Unified update completed successfully."
} catch {
    Write-Log "Error in unified update: $_"
}

Write-Log "Hourly update routine finished."
Write-Log "=========================================================="
