import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

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
  const navigate = useNavigate()
  const [data, setData] = useState({
    username: "",
    password: "",
  })
  const [error,setError] = useState("")
  const handleChange = (e) => {
    const { name, value } = e.target
    setError("")
    setData({
      ...data,
      [name]: value,
    })
  }

  const onSubmit = async () => {
    if (!data.username || !data.password) {
      setError("請輸入帳號和密碼！")
      return
    }
    try {
      const res = await axios.get(`${process.env.API_BASE_URL}login.json`)
      const { users } = res.data
      const user = users.find((item) => {
        return (
          item.username === data.username && item.password === data.password
        )
      })
      if (users) {
        const token = btoa(
          JSON.stringify({
            username: user.username,
            permissions: user.permissions,
          })
        )
        document.cookie = `authToken=${token} path=/ max-age=2592000`
        navigate("/admin/products", {
          state: { permissions: users.permissions },
        })
      }
    } catch (error) {
      setError('帳號或密碼錯誤，請重新輸入')
    }
  }

  return (
    <div className=" w-[60%] m-auto">
        <h2 className="text-5xl text-center mb-5">後台系統</h2>
        <div className="container mx-auto max-w-md shadow-md hover:shadow-lg transition duration-300">
         
          <div className="py-12 p-10 bg-white rounded-xl">
            <h2 className="mb-3">請登入帳號</h2>
            <div className="mb-2">
              <label htmlFor="email" className="mr-4 text-gray-700 font-bold inline-block mb-2">
                <span className="font-medium">Email</span>
                <input
                  id="email"
                  className="input-style focus:ring-indigo-400"
                  name="username"
                  type="email"
                  placeholder="請輸入帳號"
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="mb-2">
              <label htmlFor="password" className="mr-4 text-gray-700 font-bold inline-block mb-2">
                <span className="font-medium">密碼</span>
                <input
                  type="password"
                  className="input-style focus:ring-indigo-400"
                  name="password"
                  id="password"
                  placeholder="請輸入密碼"
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="text-sm text-red-600">{error}</div>
            <button
              type="button"
              className="w-full mt-6 text-indigo-50 font-bold bg-[#03A9F4] py-3 rounded-md hover:bg-[#0098dc] transition duration-300"
              onClick={onSubmit}
            >
              登入
            </button>
          </div>
        </div>
      
      </div>

  )
}

export default Login
