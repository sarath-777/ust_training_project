const initialState = {
    user : {},
}

const userReducer = (state = initialState, action) => {
  console.log("Inside Reducer",action.type)  
  switch(action.type){
        case 'SET_USER':
            return {
              ...state,
              user: action.payload,
            };
          case 'CLEAR_USER':
            return {
              ...state,
              user: null,
            };
          default:
            return state;
        }
      }

export default userReducer