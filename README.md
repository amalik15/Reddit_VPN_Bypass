# Reddit VPN Bypass Firefox Extension

A Firefox extension that automatically creates dummy Reddit accounts when a VPN block is detected.

## Features

- Detects Reddit VPN block pages containing phrases like "You've been blocked by network security"
- Automatically navigates to Reddit's signup page
- Generates random account data with:
  - 16-24-character alphanumeric email local part
  - 12-character alphanumeric domain name
  - 16-character alphanumeric password
- Automatically fills and submits the signup form
- Stores generated account credentials locally

## Installation

1. Package the extension by creating a ZIP file of all the project files:
   ```bash
   zip -r reddit_vpn_bypass.zip manifest.json background.js content.js account-generator.js icons/
   ```

2. Open Firefox and navigate to `about:debugging`

3. Click "This Firefox" in the left sidebar

4. Click "Load Temporary Add-on"

5. Select the `reddit_vpn_bypass.zip` file or any of the individual extension files

## File Structure

```
reddit_vpn_bypass/
├── manifest.json          # Extension configuration and permissions
├── background.js          # Background script for navigation monitoring
├── content.js            # Content script for form interaction
├── account-generator.js  # Utility for generating random account data
├── README.md            # This file
└── icons/               # Extension icons (optional)
```

## Usage

1. Install the extension in Firefox
2. Navigate to a Reddit page that shows a VPN block message
3. The extension will automatically detect the block and attempt to create a new account
4. Generated accounts are stored in the extension's local storage

## Important Notes

- This extension is for experimental purposes only
- Automated account creation may violate Reddit's Terms of Service
- Use responsibly and at your own risk


## Technical Details

- Uses WebExtensions API for Firefox compatibility
- Implements crypto-safe random number generation for account data
- Stores credentials using browser.storage.local API
- Monitors navigation using webNavigation API

## TODO:

- General error handling
- Error detection when being blocked for making too many account
- Add redirect back to reddit.com on successful sign up
- Do something with stored credentials. Potentially have stored credentials to load for account that need to be accessed again later. Potentially remove the storage of credentials permanently.

