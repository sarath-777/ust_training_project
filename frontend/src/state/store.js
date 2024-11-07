import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./UserReducer"

const store = configureStore({
    reducer: {
        user_data : userReducer,
    },
})

export default store