import { createAsyncThunk } from "@reduxjs/toolkit"
import authorizedAxiosInstance from "../../utils/axios"

export const loginUserAPI = createAsyncThunk(
  "user/loginUserAPI",
  async (data) => {
    const res = await authorizedAxiosInstance.post("/auth/login", data)
    return res.data.data
  }
)
