# Webpage Summarizer

## Demo

[Click here to watch the demo](demo.webm)

## Overview

Webpage Summarizer is a Chrome extension that allows users to generate summaries of webpages using OpenAI and download the summary as a `.txt` file. This tool is useful for quickly extracting key information from articles, blog posts, and other web content.

## Features

- Summarizes any webpage content using OpenAI.
- Downloads the summary as a `.txt` file.
- Simple UI with a popup interface.

## Installation

1. Download or clone the repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the extension folder.
5. The extension will be added to Chrome.
6. Add your OpenAI API key and specify the model name in the `background.js` file.

## Permissions

The extension requires the following permissions:

- `downloads`: To save the summary as a text file.
- `activeTab`: To access the currently open tab.
- `scripting`: To inject scripts into webpages.
- `storage`: To store extension settings.
- `host_permissions`: Allows interaction with OpenAI API and all webpages.

## File Structure

- `manifest.json`: Defines the extension’s metadata and permissions.
- `background.js`: Handles background processes.
- `popup.html`: Provides the user interface.
- `icon.png`: Icon used for the extension.

## Usage

1. Click on the Webpage Summarizer extension icon in the Chrome toolbar.
2. A popup will appear with a button to summarize the current webpage.
3. Click the button to generate a summary.
4. The summary will be available for download as a `.txt` file.

## License

This project is open-source and available under the MIT License.

## Author

Developed by [Your Name]. Contributions are welcome!
