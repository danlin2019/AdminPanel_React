// store 是狀態管理
import { configureStore } from "@reduxjs/toolkit"
import messageReducer from './slice/messageSlice'


//建立 store 把需要的 slice 加入到 store 裡面來
export const store = configureStore({
  reducer: {
    message: messageReducer
  }
})


