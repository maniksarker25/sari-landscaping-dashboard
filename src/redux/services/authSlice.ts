import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


interface AuthState {
  user: any | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  accessToken: localStorage.getItem("accessToken") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

     setToken: (state, action: PayloadAction<{ accessToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      localStorage.setItem("accessToken", action.payload.accessToken);
    },

     setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    setCredentials: (
      state,
      action: PayloadAction<{ user: any; accessToken: string }>
    ) => {
      console.log("userPaylod",action.payload)
        const { user, accessToken } = action.payload;



      state.user = user;
      state.accessToken = accessToken;

 
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
    },
    logout: (state) => {
  
      state.user = null;
      state.accessToken = null;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    },
  },
});

export const { setToken, setUser, setCredentials, logout } = authSlice.actions;


export const authReducer = authSlice.reducer;