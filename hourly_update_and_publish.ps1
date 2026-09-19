# =========================================================================
# 51Talk Dashboard Hourly Scheduled Updater & Git Publisher
# Trigger: Every hour at :10 (10 minutes past the hour)
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
Log-Message "Starting Hourly Scheduled Dashboard Update (:10 past hour)"

# Step 1: Run fresh download from 51Talk Data Center
try {
    Log-Message "Step 1: Running automated download..."
    & powershell -ExecutionPolicy Bypass -File "$workDir\auto_download_and_process.ps1" | Out-Null
    Log-Message "Download routine triggered successfully."
} catch {
    Log-Message "Error in auto-download: $_"
}

# Step 2: Run verification and data processing
try {
    Log-Message "Step 2: Processing fresh export and verifying data..."
    & powershell -ExecutionPolicy Bypass -File "$workDir\auto_process_update.ps1" | Out-Null
    Log-Message "Verification and sales data process completed."

    Log-Message "Step 2b: Processing Operations Master and Rep Leads..."
    & powershell -ExecutionPolicy Bypass -File "$workDir\generate_rep_leads_fast.ps1" | Out-Null
    & powershell -ExecutionPolicy Bypass -File "$workDir\extract_full_master.ps1" | Out-Null
    Log-Message "Operations Master extraction completed."
} catch {
    Log-Message "Error in auto-process: $_"
}

# Step 3: Git auto-commit and push updates to GitHub Pages (Live Dashboard)
try {
    Log-Message "Step 3: Syncing changes with GitHub Pages..."
    cd $workDir
    
    $status = git status --porcelain
    if ($status) {
        git add dashboard.js index.html styles.css leads/ leads_summary.json master_extracted_data.json DASHBOARD_UPDATE_RULES.md
        git commit -m "Auto-update dashboard & operations: $timestamp"
        git push origin master
        Log-Message "Live GitHub Pages dashboard updated successfully."
    } else {
        Log-Message "No data changes detected in dashboard files. Skipping commit."
    }
} catch {
    Log-Message "Error during Git push: $_"
}

Log-Message "Hourly update routine finished."
Log-Message "=========================================================="
