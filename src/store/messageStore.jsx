import { createContext } from "react";
// useContent 跨元件傳遞
export const MessageContext = createContext({})

// 初始化狀態
export const initState = {
  type:'', 
  title:'',
  text:''
}

// reducer 狀態管理
export const messageReducer = (state,action) =>{
  // console.log('isstate',state)
  switch (action.type) {
    case 'POST_MESSAGE':
      return{
       ...action.payload
      }
    case 'CLEAR_MESSAGE':
      return {
        ...initState,
      }
  
    default:
      return state
  }
}


export function handleSuccessMessage(dispatch, message) {
  dispatch({
    type: 'POST_MESSAGE',
    payload: {
      type: 'success', //success,danger
      title: '更新成功',
      text: message
    }
  });

  setTimeout(()=>{
    dispatch({
      type: 'CLEAR_MESSAGE',
    })
  },3000)
}


export function handleErrorMessage(dispatch, error) {
  dispatch({
    type: 'POST_MESSAGE',
    payload: {
      type: 'danger', //success,danger
      title: '更新失敗',
      text: Array.isArray(error?.response?.data?.message) ? error?.response?.data?.message.join(',') : error?.response?.data?.message
    }
  });
  setTimeout(()=>{
    dispatch({
      type: 'CLEAR_MESSAGE',
    })
  },3000)
}
