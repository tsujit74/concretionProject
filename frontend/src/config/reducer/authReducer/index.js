import { getAboutUser, getAllUsers, getConnectionsRequest, getMyConnectionsRequest, loginUser, registerUser } from "@/config/action/authAction"
import { createSlice } from "@reduxjs/toolkit"
import axios from "axios"



const initialState = {
    user:[],
    isError:false,
    isSucess:false,
    isLoading:false,
    message:"",
    isTokenThere:false,
    profileFetched:false,
    connections:[],
    connectionRequest:[],
    all_users:[],
    all_profiles_fetched: false
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        reset:()=> initialState,
        handleLoginUser:(state)=>{
            state.message = "hello"
        },
        emptyMessage:(state)=>{
            state.message = ""
        },
        setTokenIsThere:(state)=>{
            state.isTokenThere= true
        },
        setTokenIsNotThere:(state)=>{
            state.isTokenThere = false
        }
    },

    extraReducers:(builder)=>{
        builder.addCase(loginUser.pending,(state)=>{
            state.isLoading = true
            state.message = "Knocing the Door..."
        })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.isError = false;
            state.isSucess = false;
            state.loggedIn = true;
            state.message = "Login Sucessful"
        })
        .addCase(loginUser.rejected,(state,action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload
        })
        .addCase(registerUser.pending,(state)=>{
            state.isLoading = true;
            state.message = "Registering you..."
        })
        .addCase(registerUser.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.isError = false;
            state.isSucess = true;
            state.loggedIn = true;
            state.message = {
                message:"Registeration is Sucessful Please Log in."
            }
        })
        .addCase(registerUser.rejected,(state,action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(getAboutUser.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.isError = false;
            state.profileFetched = true;
            state.user = action.payload;
            // state.connections = action.payload.connections;
            // state.connectionRequest = action.payload.connectionRequest;
        })
        .addCase(getAllUsers.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.isError = false;
            state.all_profiles_fetched = true;
            state.all_users = action.payload;
        })
        .addCase(getConnectionsRequest.fulfilled,(state,action)=>{
            state.connections = action.payload
        })
        .addCase(getConnectionsRequest.rejected,(state,action)=>{
            state.message = action.payload
        })
        .addCase(getMyConnectionsRequest.fulfilled,(state,action)=>{
            state.connectionRequest = action.payload
        })
        .addCase(getMyConnectionsRequest.rejected,(state,action)=>{
            state.message = action.payload
        })
    }
})

export const {reset,emptyMessage, setTokenIsThere , setTokenIsNotThere} = authSlice.actions;

export default authSlice.reducer;