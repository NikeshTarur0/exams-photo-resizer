#!/usr/bin/env python3
"""
Desktop Application Launcher for Indian Exam Photo & Signature Resizer
Opens the application in a standalone native desktop window.
"""

import os
import sys
import subprocess
import webbrowser


def launch_desktop_app():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    html_file = os.path.join(base_dir, "index.html")

    if not os.path.exists(html_file):
        print(f"Error: index.html not found in {base_dir}")
        return

    file_url = f"file:///{html_file.replace(os.sep, '/')}"

    # List of common browser paths supporting native app mode (--app=)
    browser_paths = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        os.path.expanduser(r"~\AppData\Local\Google\Chrome\Application\chrome.exe"),
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"
    ]

    launched = False
    for browser in browser_paths:
        if os.path.exists(browser):
            try:
                subprocess.Popen([browser, f"--app={file_url}"])
                print(f"Launched Desktop App using: {browser}")
                launched = True
                break
            except Exception:
                continue

    if not launched:
        print("Opening in default system web browser...")
        webbrowser.open(file_url)


if __name__ == "__main__":
    launch_desktop_app()
