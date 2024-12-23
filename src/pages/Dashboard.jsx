import { Outlet , useNavigate , Link} from "react-router-dom";
import { useEffect} from "react";
import Swal from "sweetalert2";
function Dashboard() {
  const navigate = useNavigate()



  // 登出 清除 token
  const logOut = () =>{
    console.log('登出')
    document.cookie = 'authToken=;'
    navigate('/')
  }
  // 判斷是否有登入 若無登入強行由此路由進入需導回首頁
  // 取出 token 
  const token = document.cookie
  .split("; ")
  .find((row) => row.startsWith("authToken="))
  ?.split("=")[1];


  useEffect(()=>{
      if(!token){
        Swal.fire({
          title: "已登出 請重新登入",
          icon: "error",
        }).then(()=>{
          navigate('/')
        })
       
      }else{
        // 解碼 取得身份
        const userData = JSON.parse(atob(token))
        console.log(userData)
      }
  },[token,navigate])

  return (
    <>
     <nav className="navbar navbar-expand-lg bg-dark">
        <div className="container-fluid">
          <p className="text-white mb-0">
            後台管理系統
          </p>
          <div className="" >
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
      </div></>
  )
}

export default Dashboard;