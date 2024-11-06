const initialState = {
    username : 'fh123',
    isAdmin : true,
    phoneNumber : '9876543210',
    firstName : 'Fawaz',
    lastName : 'Hussain',
    residenceCode : '1000AAAA',
}

const UserReducer = (state = initialState, action) => {
    switch(action.type){
        default:
            return state
    }
}

export default UserReducer