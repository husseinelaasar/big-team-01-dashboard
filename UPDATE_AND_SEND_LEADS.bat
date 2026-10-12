@echo off
title 51Talk Big Team 01 - Update & Send Leads
color 0b
echo =========================================================================
echo  51Talk Big Team 01 - Master Leads Daily Rollover & DingTalk Broadcast
echo =========================================================================
echo.
powershell -ExecutionPolicy Bypass -File "D:\Lens\Dashboard\run_master_daily_leads_cycle.ps1"
echo.
echo =========================================================================
echo  Process Complete! Press any key to exit.
echo =========================================================================
pause
