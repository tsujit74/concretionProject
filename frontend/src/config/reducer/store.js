/** Steps for step managment
 * Submit Action
 * Handle action in it's reducer
 * Register Here -> Reducer
 */

import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../reducer/authReducer"
import postReducer from "../reducer/postReducer"
import flashMessage from '../reducer/flashMessage'

export const store = configureStore({
    reducer:{
        auth: authReducer,
        posts: postReducer,
        flashMessage: flashMessage
    }
})
