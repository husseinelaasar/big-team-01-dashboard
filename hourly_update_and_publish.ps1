# =========================================================================
# 51Talk Dashboard Hourly Scheduled Updater & Git Publisher v2.0
# Trigger: Every hour at :10 (10 minutes past the hour)
# Uses single unified update_dashboard.ps1 instead of 3 separate scripts
# =========================================================================

$ErrorActionPreference = "Continue"
$workDir = "D:\Lens\Dashboard"
$logFile = "$workDir\hourly_update.log"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

Function Log-Message([string]$msg) {
    $entry = "[$timestamp] $msg"
    Write-Host $entry
    Add-Content -Path $logFile -Value $entry
}

Log-Message "=========================================================="
Log-Message "Starting Hourly Scheduled Dashboard Update v2.0 (:10 past hour)"

# Step 1: Run fresh download from 51Talk Data Center
try {
    Log-Message "Step 1: Running automated download..."
    & powershell -ExecutionPolicy Bypass -File "$workDir\auto_download_and_process.ps1" | Out-Null
    Log-Message "Download routine triggered successfully."
} catch {
    Log-Message "Error in auto-download: $_"
}

# Step 2: Run unified update (sales + operations + leads + git deploy)
try {
    Log-Message "Step 2: Running unified dashboard update..."
    & powershell -ExecutionPolicy Bypass -File "$workDir\update_dashboard.ps1" | Out-Null
    Log-Message "Unified update completed successfully."
} catch {
    Log-Message "Error in unified update: $_"
}

Log-Message "Hourly update routine finished."
Log-Message "=========================================================="
