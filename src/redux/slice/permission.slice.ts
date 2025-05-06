import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { getPermissionAPI } from "../middleware/permission.middleware"

interface permissionState {
  value: string[]
}
const initialState: permissionState = {
  value: []
}
export const permissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getPermissionAPI.fulfilled,
      (state, action: PayloadAction<string[]>) => {
        state.value = action.payload
      }
    )
  }
})

export const selectPermission = (state: RootState) => {
  return state.permission.value
}
export default permissionSlice.reducer
