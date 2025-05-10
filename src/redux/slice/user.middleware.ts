import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { IUser } from "../../interface/user"

interface userState {
  value: IUser | null // hoặc undefined nếu chưa đăng nhập
}

const initialState: userState = {
  value: null
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser | null>) => {
      state.value = action.payload
    },
    logoutUser: (state) => {
      state.value = null
    }
  }
})
export const selectUSer = (state: RootState) => {
  return state.user.value
}

export const { setUser, logoutUser } = userSlice.actions

export default userSlice.reducer
