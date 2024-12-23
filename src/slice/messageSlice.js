import { createSlice } from "@reduxjs/toolkit";
import { Warning } from "postcss";

const predefindMessage = {
  success:{
    create:{title:'提交成功',icon:'success'},
    edit:{title:'編輯成功',icon:'success'},
  },
  error:{
    create:{title:'',icon:'error'},
    edit:{title:'編輯失敗',icon:'error'},
    delete:{title:'刪除失敗',icon:'error'}
  },
  warning:{
    delete:{title:'刪除成功',icon:'warning'}
  }
}

export const messageSlice = createSlice({
  name:'message',

  initialState:{
    title:'',
    icon:'',
    type: '',
    deleContent:[],
    isVisible: false,
  },

  reducers:{

    setMessage(state,action){
      const {type,actionType} = action.payload
      // type: success/error, actionType: submit/delete/edit
      const message = predefindMessage[type]?.[actionType]
      console.log('message',message)
      if(message){
        state.title = message.title,
        state.icon = message.icon,
        state.type = actionType
        state.isVisible = true
      }
    },
    deleteMesage(state,action){
      const {type,actionType,deleteDate} = action.payload
      state.icon = type
      state.type = actionType
      state.deleContent = deleteDate
      state.isVisible = true
    },
    clearMessage(state){
      state.title =''
      state.icon = ''
      state.type = ''
      state.isVisible = false
    },

  }

})

export const {setMessage,clearMessage,deleteMesage} = messageSlice.actions
export default messageSlice.reducer