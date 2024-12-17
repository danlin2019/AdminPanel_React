import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate()
  const [data,setData] = useState({
    username:'',
    password:''
  })
  const [loginStage, setLoginStage] = useState('')

  const handleChange = (e) =>{
    const {name,value} = e.target
    setData({...data,[name]:value})
  }

  const loginSumit = async () =>{
    try {
      const res = await axios.post('/v2/admin/signin',data)
      const {token,expired,message,success} = res.data
      console.log(token)
      console.log(expired)
      if(success){
        alert(message)
        navigate('/admin/products')
        // 
      }
      // 將 token 帶入 cookie 裡 參考文章 https://developer.mozilla.org/zh-CN/docs/Web/API/Document/cookie
      document.cookie = `hexToken = ${token}; expires=${new Date(expired)}`
    } catch (error) {
        setLoginStage(error.response.data)
    }
  }


  return (<div className="container py-5">
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h2>登入帳號</h2>
        <div className={`alert alert-danger ${loginStage.message ? 'd-block' : 'd-none'}`} role="alert">
          {loginStage.message}
        </div>
        <div className="mb-2">
          <label htmlFor="email" className="form-label w-100">
            Email
            <input id="email" className="form-control" name="username" type="email" placeholder="Email Address"  onChange={handleChange}/>
          </label>
        </div>
        <div className="mb-2">
          <label htmlFor="password" className="form-label w-100">
            密碼
            <input type="password" className="form-control"  name="password" id="password" placeholder="name@example.com" onChange={handleChange} />
          </label>
        </div>
        <button type="button" className="btn btn-primary" onClick={loginSumit}>登入</button>
      </div>
    </div>
  </div>)
}

export default Login;