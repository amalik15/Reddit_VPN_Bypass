// Background script for Firefox (Manifest V2)
// Handles messages from the content script

// Listen for messages from content script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'blockDetected') {
        console.log('Reddit block detected on tab:', sender.tab.id);
        // Navigate the tab to the signup page
        browser.tabs.update(sender.tab.id, {
            url: 'https://www.reddit.com/register/'
        });
    } else if (message.action === 'accountCreated') {
        console.log('Account creation process initiated for:', message.account.email);
        // Store the account using the storage API
        browser.storage.local.get({ accounts: [] }).then((result) => {
            const accounts = result.accounts;
            accounts.push(message.account);
            browser.storage.local.set({ accounts: accounts }).then(() => {
                console.log('Account stored successfully:', message.account.email);
            });
        });
    }
    // Return true to indicate you wish to send a response asynchronously
    return true;
});
