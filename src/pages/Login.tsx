import { useState, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 定義用戶資料型別
interface User {
  username: string;
  password: string;
  permissions: string[];
}

// 定義伺服器回傳的 JSON 資料型別
interface LoginResponse {
  users: User[];
}

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
  const navigate = useNavigate();

  // 定義表單資料狀態
  const [data, setData] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });

  // 處理輸入框變更
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 表單提交處理
  const onSubmit = async () => {
    console.log(data);

    try {
      const res = await axios.get<LoginResponse>("/login.json");
      const { users } = res.data
      console.log("users", users)

      // 驗證用戶資料
      const user = users.find((item) => 
        item.username === data.username && item.password === data.password)

      if (user) {
        // 模擬 帶 token
        const token = btoa(
          JSON.stringify({ username: user.username, permissions: user.permissions})
        );

        // 儲存 Token 到 cookie
        document.cookie = `authToken=${token}; path=/; max-age=3600`;

        // 導向到管理頁面
        navigate("/admin/products", {state: { permissions: user.permissions }});
      } else {
        alert("帳號或密碼錯誤，請重新輸入！");
      }
    } catch (error) {
      console.error("登入失敗", error);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div>
          <h2>登入帳號</h2>
          <div className="mb-2">
            <label htmlFor="email" className="form-label w-100">
              Email
              <input
                id="email"
                className="form-control"
                name="username"
                type="email"
                placeholder="Email Address"
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="form-label w-100">
              密碼
              <input
                type="password"
                className="form-control"
                name="password"
                id="password"
                placeholder="name@example.com"
                onChange={handleChange}
              />
            </label>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onSubmit}
          >
            登入
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
