@echo off
title 51Talk Big Team 01 - Dashboard One-Click Builder
color 0B
mode con: cols=85 lines=28

echo ===================================================================================
echo                     51TALK BIG TEAM 01 - EXECUTIVE DASHBOARD
echo                            ONE-CLICK BUILDER ^& PUBLISHER
echo ===================================================================================
echo.
echo  [1/3] Scanning for latest downloaded input files...
echo        - Dedicated Folder : D:\Lens\Dashboard\Dashboard_Input_Files\
echo        - Downloads Folder : %USERPROFILE%\Downloads\
echo        - Lens Root Folder : D:\Lens\
echo.
echo  [2/3] Executing Unified Fast Extraction Engine...
echo        - Parsing Sector KPIs (Cash, Ach %%, Orders from Sheet 1)
echo        - Parsing Individual Reps ^& Small Team Standings
echo        - Reconciling Upgrade M2 and Normal Renewals
echo        - Generating 8 Daily Smart Actionable Recommendations
echo        - Extracting 4 Operations Modules ^& 21 Rep Leads CSVs
echo        - Auto-Deploying to GitHub Pages (Live)
echo.
echo  ---------------------------------------------------------------------------------

powershell -ExecutionPolicy Bypass -File "%~dp0update_dashboard.ps1"

set BUILD_STATUS=%ERRORLEVEL%
echo.
echo  ---------------------------------------------------------------------------------

if %BUILD_STATUS% EQU 0 (
    color 0A
    echo.
    echo  =================================================================================
    echo    SUCCESS! Dashboard has been fully updated and published to GitHub Pages!
    echo    Live URL: https://husseinelaasar.github.io/big-team-01-dashboard/
    echo  =================================================================================
    echo.
    echo  Opening dashboard in your default browser...
    start "" "%~dp0index.html"
    start https://husseinelaasar.github.io/big-team-01-dashboard/
    echo.
    echo  [NOTE] Local dashboard opened instantly! 
    echo  GitHub Pages updates online in ~45 seconds (press Ctrl+F5 if cached).
) else (
    color 0C
    echo.
    echo  =================================================================================
    echo    ERROR: Builder encountered an issue during execution (Code: %BUILD_STATUS%).
    echo    Please check if any Excel file is locked or missing.
    echo  =================================================================================
)

echo.
echo  Press any key to exit...
pause >nul
