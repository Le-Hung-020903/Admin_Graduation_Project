import { getNotificationAPI } from "../../api"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const getNotificationsMiddleware = createAsyncThunk(
  "notification/getNotificationAPI",
  async () => {
    const res = await getNotificationAPI()
    return res
  }
)
