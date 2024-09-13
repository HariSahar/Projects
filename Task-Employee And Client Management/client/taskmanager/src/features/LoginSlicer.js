import { createSlice, createSelector } from "@reduxjs/toolkit";

const Loginslice = createSlice({
  name: "login",
  initialState: {
    data: {},
  },
  reducers: {
    login: (state, action) => {
      //console.log("Dispatched login data:", action.payload);
      state.data = action.payload;
    },
    // SelectUserRole: createSelector(
    //   (state) => state.login.data,
    //   (loginData) => loginData?.ROLES || null
    // ),
  },
});

export const { login, SelectUserRole } = Loginslice.actions;
export default Loginslice.reducer;
