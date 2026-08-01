import { configureStore } from "@reduxjs/toolkit";
import baseApis from "./baseApis";
import { authReducer } from "./services/authSlice";

const store = configureStore({
  reducer: {
    [baseApis.reducerPath]: baseApis.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware().concat(baseApis.middleware),
});
//
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
