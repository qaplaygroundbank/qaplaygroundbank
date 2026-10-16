
const loginPageSelectors = {
  // Username input
    userNameTextBox: {
        type: 'testId',
        value: 'login-username-input'
    },
    // Password input
    passwordTextBox: {
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
