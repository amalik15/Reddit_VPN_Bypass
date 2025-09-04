// Content script for detecting Reddit block pages and handling form interaction

// --- Helper Functions ---

function isBlockPage() {
    const blockIndicators = [
        'blocked', 'network security', 'access denied',
        'vpn detection', 'suspicious activity', "you've been blocked"
    ];
    const pageText = document.body.textContent.toLowerCase();
    return blockIndicators.some(indicator => pageText.includes(indicator));
}

// --- Signup Automation Flow ---

async function fillAndSubmitSignupForm() {
    const account = generateAccount();
    console.log('Generated account:', account.email);

    try {
        // Helper function to simulate full user input
        const simulateUserInput = (inputElement, value) => {
            inputElement.focus();
            inputElement.value = value;
            inputElement.dispatchEvent(new Event('input', { bubbles: true }));
            inputElement.dispatchEvent(new Event('change', { bubbles: true }));
            inputElement.blur();
        };

        // Step 1: Fill Email
        console.log('Step 1: Filling email');
        const emailWrapper = await waitForElement('#register-email');
        const emailInput = emailWrapper.shadowRoot.querySelector('input');
        simulateUserInput(emailInput, account.email);
        await sleep(500); // Wait for UI to update

        // Step 2: Click Continue after email
        console.log('Step 2: Clicking continue after email');
        const continueButton1 = await waitForElement('auth-flow-modal[pagename="register_email"] button.continue:not(:disabled)');
        continueButton1.click();
        console.log('Email submitted.');

        // Step 3: Click "Skip" on the email verification prompt
        console.log('Step 3: Looking for skip button');
        try {
            const skipButton = await waitForElement('auth-flow-email-verify button[name="skip"]', 5000);
            skipButton.click();
            console.log('Skip button clicked.');
        } catch (e) {
            console.log('Skip button not found, continuing...');
        }

        // Step 4: Fill Username and Password
        console.log('Step 4: Filling username and password');

        const usernameWrapper = await waitForElement('#register-username');
        const usernameInput = usernameWrapper.shadowRoot.querySelector('input');
        simulateUserInput(usernameInput, account.username);

        const passwordWrapper = await waitForElement('#register-password');
        const passwordInput = passwordWrapper.shadowRoot.querySelector('input');
        simulateUserInput(passwordInput, account.password);
        await sleep(500);

        // Step 5: Click final Continue/Submit button
        console.log('Step 5: Clicking final submit');
        const continueButton2 = await waitForElement('auth-flow-modal[pagename="register_username_and_password"] button.create:not(:disabled)');
        continueButton2.click();
        console.log('Username and password submitted.');

        // TODO: Check for issues before storing account

        // Send account info to background script to be stored
        browser.runtime.sendMessage({ action: 'accountCreated', account: account });

        // TODO: Redirect to the homepage to bypass any further onboarding. Add back once error handling is added.
        // window.location.href = 'https://www.reddit.com/';

    } catch (error) {
        console.error('Error during signup automation:', error);
    }
}

// --- Utility Functions for Automation ---

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const intervalTime = 100;
        let elapsedTime = 0;
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                resolve(element);
            }
            elapsedTime += intervalTime;
            if (elapsedTime >= timeout) {
                clearInterval(interval);
                reject(new Error(`Timeout waiting for element: ${selector}`));
            }
        }, intervalTime);
    });
}


// --- Main Execution Logic ---

// Use a brief delay to ensure the page is settled
setTimeout(() => {
    if (isBlockPage()) {
        console.log('Reddit block page detected. Notifying background script.');
        browser.runtime.sendMessage({ action: 'blockDetected' });
    } else if (window.location.href.includes('reddit.com/register')) {
        console.log('Reddit register page detected. Starting automation.');
        fillAndSubmitSignupForm();
    }
}, 1000);


