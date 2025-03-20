import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name:"feed",
    initialState:null,
    reducers:{
        addFeed:(state,action)=>{
            return action.payload;
        },
        removeUserFeed:(state,action) => {
            const newFeed = state.filter((user) => user._id !== action.payload.receiverId);
            console.log("newFeed", newFeed);
            return newFeed
        },
        removeFeed:(state,action) => null
    }
})

export const {addFeed, removeFeed, removeUserFeed} = feedSlice.actions
export default feedSlice.reducer