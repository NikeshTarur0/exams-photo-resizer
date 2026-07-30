@echo off
title Git Update - Exams Photo Resizer
echo Staging all changes...
git add .

echo Committing changes...
git commit -m "Update AdSense ad units for Display_reducer and Home_reducer"

echo Pushing to GitHub...
git push

echo.
echo =========================================
echo Git repository updated successfully!
echo =========================================
pause
