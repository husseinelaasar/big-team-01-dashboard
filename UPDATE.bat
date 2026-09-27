@echo off
echo =========================================================================
echo  51Talk Executive Dashboard - One-Click Unified Update v2.0
echo =========================================================================
echo.

echo Running unified update script...
powershell -ExecutionPolicy Bypass -File "%~dp0update_dashboard.ps1"

echo.
echo =========================================================================
echo  Update Complete! Live: https://husseinelaasar.github.io/big-team-01-dashboard/
echo =========================================================================
pause
