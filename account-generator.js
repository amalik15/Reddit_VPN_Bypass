// Utility functions for generating random account data

/**
 * Generates a random alphanumeric string of specified length
 * @param {number} length - Length of the string to generate
 * @returns {string} Random alphanumeric string
 */
function generateRandomAlphanumeric(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const randomValues = new Uint8Array(length);
    window.crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
        result += chars[randomValues[i] % chars.length];
    }
    return result;
}

/**
 * Generates a complete email address with a random length local part and a 12-character domain
 * @returns {string} Email address in format: [16-24 chars]@[12 chars].com
 */
function generateEmail() {
    const getRandomLength = () => Math.floor(Math.random() * (24 - 16 + 1)) + 16; // Generates a number between 16 and 24
    const localPart = generateRandomAlphanumeric(getRandomLength());
    const domainPart = generateRandomAlphanumeric(12);
    return `${localPart}@${domainPart}.com`;
}

/**
 * Generates a random 16-character alphanumeric password
 * @returns {string} 16-character password
 */
function generatePassword() {
    return generateRandomAlphanumeric(16);
}

/**
 * Generates a username based on the email local part
 * @param {string} email - The generated email
 * @returns {string} Username (first 20 chars of local part)
 */
function generateUsername(email) {
    const localPart = email.split('@')[0];
    return localPart.substring(0, Math.min(20, localPart.length));
}

/**
 * Generates complete account data
 * @returns {Object} Account data with email, password, and username
 */
function generateAccount() {
    const email = generateEmail();
    const password = generatePassword();
    const username = generateUsername(email);

    return {
        email: email,
        password: password,
        username: username,
        createdAt: new Date().toISOString()
    };
}
