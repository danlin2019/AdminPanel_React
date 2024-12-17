import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";

export const messageSlice = createSlice({
  name: 'message',
  initialState:[],

  reducers:{
    creatMessage(state,action){
      console.log('action',action.payload)
      // const id = new Date().getTime() //用時間搓記來當id
      if(action.payload.success){
        state.push({
          id:action.payload.id,
          type: 'success',
          title:'建立成功',
          text: action.payload.message
        });
      }else{
        state.push({
          id:action.payload.id,
          type: 'danger',
          title:'建立失敗',
          text: Array.isArray(action.payload.message) ? action.payload.message.join(',') : action.payload.message
        });
      }
    },
    removeMessage(state,action){
      const index = state.findIndex(item => item === action.payload)
      state.splice(index,1)
    }
  }
})

// React 建立非同步方法
// createAsyncThunk 會帶入兩個參數 第一個是自定義名稱 第二個是 asycn function
export const createAsyncMessage = createAsyncThunk(
  'message/createAsyncMessage',
  // 一樣會帶入兩個參數
  async function (payload,{ dispatch, requestId}){
    console.log('createAsyncMessagepayload',payload)
    dispatch(
      messageSlice.actions.creatMessage({
        ...payload,
        id:requestId
      })
    )

    setTimeout(()=>{
      dispatch(messageSlice.actions.removeMessage(requestId))
     
    },3000)


  }
)


export const {creatMessage} = messageSlice.actions
export default messageSlice.reducer