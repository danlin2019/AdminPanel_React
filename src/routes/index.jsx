import App from '../App'
import Login from '../pages/Login'; // 登入
import Dashboard from '../pages/Dashboard'; // 左邊選項
import AdminProducts from '../pages/AdminProducts'; // 產品列表
import AdminAdProduct from '../pages/AdminAdProduct';// 新增商品
import AdminOrderProducts from '../pages/AdminOrderProduct';
import AdminOrderDetail from '../pages/AdminOrderDetail';
import Charts from '../pages/Charts';


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
            path:'addproduct',
            element:<AdminAdProduct/>
          },
          {
            path:'orders',
            element:<AdminOrderProducts/>
          },
          {
          path:'orderdetail',
          element:<AdminOrderDetail/>
          },
          {
            path:'charts',
            element:<Charts/>
          }
        ]
      },
     
    ]
  },
];

const router = createHashRouter(routes)
export default router