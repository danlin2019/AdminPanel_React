import { Outlet , useNavigate , Link} from "react-router-dom";
import axios from "axios";
import { useEffect, useReducer } from "react";
import Message from "../../components/admin/Message";
import {MessageContext,messageReducer,initState} from '../../store/messageStore'
function Dashboard() {
  const navigate = useNavigate()

  // 第一個是 reducer的狀態管理，第二是你的預設狀態
  const reducer = useReducer(messageReducer,initState)
  // console.log(reducer)

  // 登出 清除 token
  const logOut = () =>{
    console.log('登出')
    document.cookie = 'hexToken=;'
    navigate('/login')
  }
  // 判斷是否有登入 若無登入強行由此路由進入需導回首頁
  // 取出 token 
  const token = document.cookie
  .split("; ")
  .find((row) => row.startsWith("hexToken="))
  ?.split("=")[1];
  // axios 預設值的headers 必須夾帶驗證的資訊 參考文章 https://github.com/axios/axios#global-axios-defaults
  axios.defaults.headers.common['Authorization'] = token
  useEffect(()=>{
      if(!token){
        navigate('/login')
      }
      // 防呆 若token錯誤
      (async ()=>{
        try {
          const res = await axios.post('/v2/api/user/check')
        } catch (error) {
          if(!error.response.data.success){
            navigate('/login')
          }
        }
      })()
  },[token,navigate])

  return (
    <MessageContext.Provider value={reducer}>
      <Message/>
      <nav className="navbar navbar-expand-lg bg-dark">
        <div className="container-fluid">
          <p className="text-white mb-0">
            後台管理系統
          </p>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <button type="button" className="btn btn-sm btn-light" onClick={logOut}>
                  登出
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="d-flex">
        <div className="bg-light" >
          <ul className="list-group list-group-flush">
            <Link className="list-group-item list-group-item-action py-3" to="/admin/products">
              <i className="bi bi-cup-fill me-2" />
              產品列表
            </Link>
            <Link className="list-group-item list-group-item-action py-3" to="/admin/coupons">
              <i className="bi bi-ticket-perforated-fill me-2" />
              優惠卷列表
            </Link>
            <Link className="list-group-item list-group-item-action py-3" to="/admin/orders">
              <i className="bi bi-receipt me-2" />
              訂單列表
            </Link>
          </ul>
        </div>
        <div className="w-100">
          {/* Products  需先判斷 有無token */}
          {token && <Outlet/>}
          {/* Products end */}
        </div>
      </div>
    </MessageContext.Provider>
  )
}

export default Dashboard;