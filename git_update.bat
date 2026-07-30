@echo off
title Git Update - Exams Photo Resizer
echo Staging all changes...
git add .

echo Committing changes...
git commit -m "Remove Display_reducer AdSense ad unit"

echo Pushing to GitHub...
git push

echo.
echo =========================================
echo Git repository updated successfully!
echo =========================================
pause
