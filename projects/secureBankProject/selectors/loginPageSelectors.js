
const loginPageSelectors = {
  // Username input
    usernameInput: {
        type: 'testId',
        value: 'login-username-input'
    },
    // Password input
    passwordInput: {
        type: 'testId',
        value: 'login-password-input'
    },
    // Login button
    loginButton: {
        type: 'role',
        role: 'button',
        name: 'Sign in to SecureBank'
    },
   
    // *******THE FOLLOWING SELECTORS ARE SAMPLE USE CASES TO DEMONSTRATE DIFFERENT SELECTION METHODS *****
    // transferButton: {
    //   type: 'css',
    //   value: '.transfer-button'
    // },
    // usernameInput: {
    //   type: 'id',
    //   value: 'username'
    // }
};

export default loginPageSelectors;
