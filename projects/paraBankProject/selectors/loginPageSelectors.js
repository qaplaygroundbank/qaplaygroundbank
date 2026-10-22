const loginPageSelectors = {

    // Username input
    usernameInput: {
        type: 'css',
        value: 'input[name="username"]'
    },

    // Password input
    passwordInput: {
        type: 'css',
        value: 'input[name="password"]'
    },

    // Login button
    loginButton: {
        type: 'css',
        value: 'input[type="submit"][value="Log In"]'
    },

    welcomeMessage: {
        type: 'css',
        value: '.smallText'
    },

    logoutLink: {
        type: 'css',
        value: 'a[href="logout.htm"]'
    }

};
export default loginPageSelectors;