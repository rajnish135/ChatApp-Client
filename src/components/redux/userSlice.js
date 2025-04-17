import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    
  name: 'user',

  initialState: {
    name: "",
    _id: "",
    email: "",
    profile_pic: "",
    token: "",
    onlineUser:[],
    socketConnection : null,
  },

  reducers: {

    setUser: (state,action)=>{
        state._id = action.payload._id
        state.email = action.payload.email
        state.profile_pic = action.payload.profile_pic
        state.name = action.payload.name
    },

    setToken: (state,action)=>{
            state.token = action.payload
    },

    logout: (state,action)=>{
        state._id = ""
        state.email = ""
        state.profile_pic = ""
        state.name = ""
        state.token = ""
    },
    setOnlineUser: (state,action)=>{
      state.onlineUser = action.payload
    },
    setSocketConnection: (state,action)=>{
      state.socketConnection = action.payload
    }
    
  }

})

export const {setUser,logout,setToken,setOnlineUser,setSocketConnection} = userSlice.actions;
export default userSlice.reducer;