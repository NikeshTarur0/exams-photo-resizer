@echo off
title Indian Exam Photo & Signature Resizer Desktop App
echo Starting Indian Exam Resizer Application...
set HTML_PATH=%~dp0index.html

:: Launch Chrome in Standalone Desktop Application Mode
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --app="file:///%HTML_PATH%"
    exit
)

if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --app="file:///%HTML_PATH%"
    exit
)

:: Fallback to Microsoft Edge App Mode
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app="file:///%HTML_PATH%"
    exit
)

:: Fallback to Default Browser
start "" "%HTML_PATH%"
