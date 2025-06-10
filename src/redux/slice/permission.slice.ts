import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { getPermissionAPI } from "../middleware/permission.middleware"

interface permissionState {
  value: string[]
  is_fetch: boolean
}
const initialState: permissionState = {
  value: [],
  is_fetch: false
}
export const permissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        getPermissionAPI.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          state.value = action.payload
          state.is_fetch = true
        }
      )
      .addCase(getPermissionAPI.rejected, (state) => {
        // vẫn đánh dấu là đã cố fetch
        state.is_fetch = true
      })
      .addCase(getPermissionAPI.pending, (state) => {
        // mỗi lần gọi lại => reset loading
        state.is_fetch = false
      })
  }
})

export const selectPermission = (state: RootState) => {
  return state.permission.value
}
export const selectIsFetch = (state: RootState) => {
  return state.permission.is_fetch
}
export default permissionSlice.reducer
