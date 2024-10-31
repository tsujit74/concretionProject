import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/api/users/login", {
        email: user.email,
        password: user.password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      } else {
        return thunkAPI.rejectWithValue({
          message: "token not provided",
        });
      }

      return thunkAPI.fulfillWithValue(response.data.token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      const request = await clientServer.post("/api/users/register", {
        username: user.username,
        password: user.password,
        email: user.email,
        name: user.name,
      });
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get(
        "/api/users/get_user_and_profile",
        {
          params: {
            token: user.token,
          },
        }
      );

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/api/users/get_all_users");
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const sendConnectionRequest = createAsyncThunk(
  "user/sendConnectionRequest",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post(
        "api/users/send_connection_request",
        {
          token: user.token,
          connectionId: user.user_id,
        }
      );
      thunkAPI.dispatch(getConnectionsRequest({token:user.token}))
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const getConnectionsRequest = createAsyncThunk(
  "user/getConnectionRequest",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get("api/users/getConnectionRequest", {
        params: { token: user.token },
      });
      // Return the connections array from the response
      return thunkAPI.fulfillWithValue(response.data.connections);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);


export const getMyConnectionsRequest = createAsyncThunk(
  "user/getMyConnectionRequest",
  async(user,thunkAPI)=>{
    try {
      const response = await clientServer.get("api/users/user_connection_request",{
        params:{
          token:user.token
        }
      })
      return thunkAPI.fulfillWithValue(response.data)
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
)

export const acceptConnection = createAsyncThunk(
  "user/acceptConnection",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("api/users/accept_connection_request", {
        token: user.token,
        requestId: user.connectionId, 
        action_type: user.action
      });
      thunkAPI.dispatch(getMyConnectionsRequest({token:user.token}))
      thunkAPI.dispatch(getConnectionsRequest({token:localStorage.getItem('token')}))
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "An error occurred");
    }
  }
);