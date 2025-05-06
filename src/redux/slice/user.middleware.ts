import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { IUser } from "../../interface/user"
import { loginUserAPI } from "../middleware/user.middleware"

interface userState {
  value: IUser | null // hoặc undefined nếu chưa đăng nhập
}

const initialState: userState = {
  value: null
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      loginUserAPI.fulfilled,
      (state, action: PayloadAction<IUser>) => {
        state.value = action.payload
      }
    )
  }
})
export const selectUSer = (state: RootState) => {
  return state.user.value
}

export default userSlice.reducer
