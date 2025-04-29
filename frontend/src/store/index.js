import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import searchReducer from "./slice/searchSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    search: searchReducer,
  },
});

export default store;
