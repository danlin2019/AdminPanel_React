import App from '../App'
import Login from '../pages/Login'; // 登入
import Dashboard from '../pages/admin/Dashboard'; // 左邊選項
import AdminProducts from '../pages/admin/AdminProducts'; // 產品列表
import AdminAdProduct from '../pages/admin/AdminAdProduct' //新增商品
import AdminCoupons from '../pages/admin/AdminCoupons' // 優惠卷列表
import AdminOrders from '../pages/admin/AdminOrders';  // 訂單列表

import { createHashRouter } from 'react-router-dom';
//  Plain Object Router 路由表 
const routes = [
  {
    path:'/',
    element: <App />,
    children:[
      {
        index:true,
        element: <Login />,
      },
      {
        path:'admin',
        element:<Dashboard/>,
        children:[
          {
            path:'products',
            element:<AdminProducts/>
          },
          {
            path:'coupons',
            element:<AdminCoupons/>
          },
          {
            path:'orders',
            element:<AdminOrders/>
          },
          {
            path:'addproduct',
            element:<AdminAdProduct/>
          },
        ]
      },
     
    ]
  },
];

const router = createHashRouter(routes)
export default router

// git remote add origin https://github.com/danlin2019/AdminPanel_React.git
// git branch -M main
// git push -u origin main