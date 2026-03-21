import webview
from pathlib import Path
import sys
import os

# Get the directory where this script is located
if getattr(sys, 'frozen', False):
    script_dir = Path(sys.executable).parent
else:
    script_dir = Path(__file__).parent

# Path to the HTML file
html_file = script_dir / "Organized_Bookmarks.html"

if html_file.exists():
    # Create a local file URL
    file_url = f"file:///{html_file.replace(chr(92), '/')}"
    
    # Create and show the window
    webview.create_window(
        title='My Organized Bookmarks',
        url=file_url,
        width=1400,
        height=800,
        resizable=True,
        background_color='#f4f7f6'
    )
    webview.start()
else:
    # Show error window
    error_html = f"""
    <html>
    <head>
        <title>Error</title>
        <style>
            body {{ font-family: Segoe UI, Arial; text-align: center; padding: 40px; }}
            h1 {{ color: #e74c3c; }}
            p {{ color: #555; font-size: 14px; }}
        </style>
    </head>
    <body>
        <h1>❌ File Not Found</h1>
        <p><strong>Organized_Bookmarks.html</strong> not found.</p>
        <p>Expected location: {html_file}</p>
        <p>Make sure the HTML file is in the same folder as this app.</p>
    </body>
    </html>
    """
    webview.create_window(
        title='Error - Bookmarks',
        html=error_html,
        width=500,
        height=300
    )
    webview.start()
