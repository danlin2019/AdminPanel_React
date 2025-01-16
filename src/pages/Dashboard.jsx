import { SiProducthunt } from "react-icons/si"
import { VscListOrdered } from "react-icons/vsc"
import { FaChartSimple } from "react-icons/fa6"
import { Outlet, useNavigate,NavLink } from "react-router-dom"
import { useEffect } from "react"
import Swal from "sweetalert2"
function Dashboard() {
  const navigate = useNavigate()

  // 登出 清除 token
  const logOut = () => {
    document.cookie = "authToken="
    navigate("/")
  }
  // 判斷是否有登入 若無登入強行由此路由進入需導回首頁
  // 取出 token
  const token = document.cookie
    .split(" ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1]

  useEffect(() => {
    if (!token) {
      Swal.fire({
        title: "已登出 請重新登入",
        icon: "error",
      }).then(() => {
        navigate("/")
      })
    } else {
      // 解碼 取得身份
      // const userData = JSON.parse(atob(token))
      // console.log(userData)
    }
  }, [token, navigate])

  return (
    <div className=" w-full animate-fadeIn">
      <header className="fixed top-0 left-0 w-full p-3 shadow-lg bg-gradient-to-l from-[#476bb5] from-10% via-[#476bb5] via-40% to-[#5aade4] z-20">
        <nav className="flex justify-between">
          <h2 className="text-white text-xl font-medium">後台管理系統</h2>
          <div className="">
            <button
              type="button"
              className="bg-white px-2 py-1 rounded transition duration-300 hover:bg-slate-400 hover:text-white font-normal"
              onClick={logOut}
            >
              登出
            </button>
          </div>
        </nav>
      </header>
      <div className="flex w-full mt-14 h-[calc(100%-3.5rem)]">
        <div className="fixed top-0 left-0 h-full bg-[#f5f5f5] shadow-custom w-[171px] px-4 pt-24">
          <ul className="left-nav">
            <li>
              <NavLink to="/admin/products"><SiProducthunt/>產品列表</NavLink>
            </li>
            <li>
              <NavLink to="/admin/orders"><VscListOrdered/>訂單列表</NavLink>
            </li>
            <li>
              <NavLink to="/admin/charts"><FaChartSimple/>銷量數據</NavLink>
            </li>
          </ul>
        </div>
        <div className=" relative left-[calc(100%-(100%-171px))] w-[calc(100%-171px)] bg-white py-9 ">
          {/* Products  需先判斷 有無token */}
          {token && <Outlet />}
          {/* Products end */}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
