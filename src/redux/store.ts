import { configureStore } from "@reduxjs/toolkit"
import permissionReducer from "../redux/slice/permission.slice"
import userReducer from "../redux/slice/user.middleware"

export const store = configureStore({
  reducer: {
    permission: permissionReducer,
    user: userReducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
