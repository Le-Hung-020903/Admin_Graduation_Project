import { createAsyncThunk } from "@reduxjs/toolkit"
import authorizedAxiosInstance from "../../utils/axios"

export const getPermissionAPI = createAsyncThunk(
  "permission/getPermissionAPI",
  async () => {
    const res = await authorizedAxiosInstance.get("user/permissions")
    return res.data.data
  }
)
