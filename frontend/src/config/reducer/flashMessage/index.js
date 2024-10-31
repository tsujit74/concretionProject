import { createSlice } from "@reduxjs/toolkit"


const flashMessageSlice = createSlice({
    name:"flashMessage",
    initialState:{
        message:"",
        type:""
    },
    reducers:{
        setFlashMessage:(state,action)=>{
            state.message = action.payload.message;
            state.type = action.payload.type;
        },
        clearFlashMessage:(state)=>{
            state.message="";
            state.type="";
        }
    }
})

export const {setFlashMessage,clearFlashMessage} = flashMessageSlice.actions;
export default flashMessageSlice.reducer