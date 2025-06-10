import { configureStore } from "@reduxjs/toolkit"
import permissionReducer from "../redux/slice/permission.slice"
import userReducer from "../redux/slice/user.middleware"
import notificationReducer from "../redux/slice/notification.slice"

export const store = configureStore({
  reducer: {
    permission: permissionReducer,
    user: userReducer,
    notification: notificationReducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
