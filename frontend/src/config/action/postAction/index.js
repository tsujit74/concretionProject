import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async(_,thunkAPI)=>{
        try {
            const response = await clientServer.get("/api/posts/posts")
            return thunkAPI.fulfillWithValue(response.data)
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)

export const createPost = createAsyncThunk(
    "post/createPost",
    async(userData,thunkAPI)=>{
        const {file,body}=userData;

        try {
            const formData = new FormData();
            formData.append("token",localStorage.getItem("token"))
            formData.append('body',body)
            formData.append('media',file)

            const response = await clientServer.post("api/posts/post",formData,{
                headers:{
                    'Content-Type': 'multipart/form-data'
                }
            } );

            if(response.status === 200){
                return thunkAPI.fulfillWithValue("Post Created")
            }else{
                return thunkAPI.rejectWithValue("Post Not Created");
            }
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)

export const deletePost = createAsyncThunk(
    "post/deletePost",
    async (post_id,thunkAPI) => {
        try {
            const response = await clientServer.delete("api/posts/delete_post",{
                data:{
                    token: localStorage.getItem("token"),
                    post_id: post_id.post_id
                }
            })
            return thunkAPI.fulfillWithValue(response.data);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)

export const incrementLike = createAsyncThunk(
    "post/incrementLike",
    async(post,thunkAPI)=>{
        try {
            const response = await clientServer.post('api/posts/increment_post_likes',{
                post_id:post.post_id
            })
            return thunkAPI.fulfillWithValue("Liked");
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)

export const getAllComments = createAsyncThunk(
    "post/getAllComment",
    async (postData,thunkAPI) => {
        try {
            const response = await clientServer.get("api/posts/get_comments",{
                params:{
                    post_id:postData.post_id
                }
            });
            return thunkAPI.fulfillWithValue({
                comments:response.data,
                post_id:postData.post_id
            })

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)

export const postComment = createAsyncThunk(
    "post/postComment",
    async (commentData, thunkAPI) => {
        try {
            const response = await clientServer.post("api/users/comment", {
                token: localStorage.getItem("token"),
                post_id: commentData.post_id,
                commentBody: commentData.body
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);
