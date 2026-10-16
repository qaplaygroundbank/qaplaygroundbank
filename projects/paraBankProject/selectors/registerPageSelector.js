const registerPageSelectors = {

     firstnameInput: {
         type: 'id',
       value: 'customer.firstName'
     },

     lastnameInput:{
        type : 'id',
        value : 'customer.lastName'
     }, 

     address: {
        type : 'id',
        value : 'customer.address.street'
     },

     city :{
        type : 'id',
        value : 'customer.address.city'
     },

     state:{
        type: 'id',
        value : 'customer.address.state'
     },

     zipcode:{
        type : 'id',
        value : 'customer.address.zipCode'
     },

     phone:{
        type: 'id',
        value : 'customer.phoneNumber'
     }, 

     ssn:{
        type : 'id',
        value : 'customer.phoneNumber'
     }, 

     username:{
        type : 'id',
        value : 'customer.username'
     }, 

     password:{
        type : 'id',
        value : 'customer.password'
     }, 

     confirmPassword:{
        type : 'id',
        value : 'repeatedPassword'
     }
}