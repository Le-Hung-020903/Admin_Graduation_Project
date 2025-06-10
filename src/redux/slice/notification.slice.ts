import { INotifications } from "../../interface/notification"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { getNotificationsMiddleware } from "../middleware/notification.middleware"
import { RootState } from "../store"

interface NotificationState {
  notifications: INotifications[] | null
  is_fetch: boolean
}

const initialState: NotificationState = {
  notifications: null,
  is_fetch: false
}

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<INotifications>) => {
      state.notifications = state.notifications
        ? [action.payload, ...state.notifications]
        : [action.payload]
    }
  },
  extraReducers: (builder) => {
    builder.addCase(
      getNotificationsMiddleware.fulfilled,
      (state, action: PayloadAction<INotifications[]>) => {
        state.notifications = action.payload
        state.is_fetch = true
      }
    )
  }
})

export const selectLengthNotification = (state: RootState) => {
  return state.notification.notifications
    ? state.notification.notifications.filter((n) => !n.is_read).length
    : 0
}
export const selectIsFetched = (state: RootState) => state.notification.is_fetch
export const selectNotifications = (state: RootState) =>
  state.notification.notifications

export const { addNotification } = notificationSlice.actions

export default notificationSlice.reducer
