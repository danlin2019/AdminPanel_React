import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


/**
 * 登入
 * 取得帳號密碼的值
 * 送出時須先判斷是否空值
 * 打假API 比對(find) 帳號密碼是否有正確
 * 做防呆
 * 如果正確 產生TOKEN 存取到 cookie
 * 錯誤 請重新輸入
 */
function Login() {
  const navigate  = useNavigate()
  const [data,setData] = useState({
    username : '',
    password : ''
  })

const handleChange = (e) =>{
  const {name,value} = e.target
  
  setData({
    ...data,
    [name]:value
  })
  
}
const onSubmit = async () =>{
  console.log(data)
  //
  try {
    const res = await axios.get('/login.json')
    const {users} = res.data
    console.log(users)
    const user = users.find((item)=>{
      return item.username === data.username && item.password === data.password
    })
    console.log('user',user)

    if(users) {
      const token = btoa(JSON.stringify({ username: user.username, permissions: user.permissions }));
      console.log(token)
      document.cookie = `authToken=${token}; path=/; max-age=3600`;
      navigate('/admin/products',{state:{permissions: users.permissions}})
      // ,{state:{type,productList:product}}
    }
  } catch (error) {
    
  }
}


  return (<div className="container">
    <div className="row justify-content-center">
      <div>
        <h2>登入帳號</h2>
       
        <div className="mb-2">
          <label htmlFor="email" className="form-label w-100">
            Email
            <input id="email" className="form-control" name="username" type="email" placeholder="Email Address" onChange={handleChange}/>
          </label>
        </div>
        <div className="mb-2">
          <label htmlFor="password" className="form-label w-100">
            密碼
            <input type="password" className="form-control"  name="password" id="password" placeholder="name@example.com"  onChange={handleChange}/>
          </label>
        </div>
        <button type="button" className="btn btn-primary" onClick={onSubmit}>登入</button>
      </div>
    </div>
  </div>)
}

export default Login;