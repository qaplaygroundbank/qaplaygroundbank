// Profile Page Selectors
// Module: Profile

const profilePageSelectors = {

    // PROF-001 - Verify User Can Successfully Access The Profile Page

    // Profile navigation menu
    profileLink: {
        type: 'testId',
        value: 'sidebar-link-profile'
    },

    // Profile page container
    profilePage: {
        type: 'testId',
        value: 'profile-page'
    },

    // Profile page title
    profilePageTitle: {
        type: 'testId',
        value: 'profile-page-title'
    },

    // Personal Information section
    personalInfoSection: {
        type: 'testId',
        value: 'personal-info-section'
    },

    // Edit Profile button
    editProfileButton: {
        type: 'testId',
        value: 'edit-profile-btn'
    },

    // PROF-002 - Verify User Profile Information Is Displayed Correctly

    // Username displayed on profile page
    username: {
        type: 'testId',
        value: 'profile-username'
    },

    // First name displayed on profile page
    firstName: {
        type: 'testId',
        value: 'profile-first-name'
    },

    // Last name displayed on profile page
    lastName: {
        type: 'testId',
        value: 'profile-last-name'
    },

    // Email displayed on profile page
    email: {
        type: 'testId',
        value: 'profile-email'
    },

    // Phone number displayed on profile page
    phone: {
        type: 'testId',
        value: 'profile-phone'
    },

    // Address displayed on profile page
    address: {
        type: 'testId',
        value: 'profile-address'
    },

    // PROF-012 - Verify Phone Boundary Length Validation

    // First Name input field
    firstNameInput: {
        type: 'testId',
        value: 'profile-first-name-input'
    },

    // Last Name input field
    lastNameInput: {
        type: 'testId',
        value: 'profile-last-name-input'
    },

    // Email input field
    emailInput: {
        type: 'testId',
        value: 'profile-email-input'
    },

    // Phone input field
    phoneInput: {
        type: 'testId',
        value: 'profile-phone-input'
    },

    // Address input field
    addressInput: {
        type: 'testId',
        value: 'profile-address-input'
    },

    // Save Changes button
    saveProfileButton: {
        type: 'testId',
        value: 'save-profile-btn'
    },

    // Cancel Changes button
    cancelEditProfileButton: {
        type: 'testId',
        value: 'cancel-edit-profile-btn'
    }
};

export default profilePageSelectors;