@echo off
title Quick Sort E-Learning Local Server
echo Starting local web server...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
