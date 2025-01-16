import axios from 'axios'
import { useEffect, useState } from 'react'
import { useLocation } from "react-router-dom"
import { useDispatch } from "react-redux"
import { deleteMesage,setMessage } from "../slice/messageSlice"
import Loading from '../components/Loading'
import { useProductNavigation } from "../components/useProductNavigation"

function AdminOrderDetail() {
  const dispatch = useDispatch()
  const [isState, setIsState] = useState('未處理')
  const [isOrderData, setIsOrderData] = useState({})
  const [error, setError] = useState(null) // 錯誤狀態
  const [loadingState,setLoadingState] = useState(false)
  const location = useLocation()
  const state = location?.state || {}
  const orderData = state?.orderData || null
  const { openDeteleProduct } = useProductNavigation()


  useEffect(() => {
    if (orderData) {
      getOrdData()
    } else {
      setError('缺少訂單 ID')
    }
  }, [])

  const getOrdData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_APP_API_URL}getOrder?id=${orderData}`)
      setIsOrderData(res?.data?.order || {})
      setIsState(res?.data?.order?.orderstate || '未處理')
    } catch (err) {
      setError('無法載入訂單資料，請稍後再試')
    }
  }
  // 更新狀態
  const updateOrder = async (uddateOrder) =>{
    setLoadingState(true)
    console.log(uddateOrder)
    try {
      const res =  await axios.put(`${import.meta.env.VITE_APP_API_URL}updateOrder`,{
        orderId:uddateOrder.id,
        updates:uddateOrder
      })
      console.log('訂單更新成功:', res.data.message)
      dispatch(setMessage({
        type: "success",
        actionType: 'orderdata',
      }))
      setLoadingState(false)
    } catch (error) {
      console.error('更新訂單失敗:', error.response?.data?.message || error.message)
    }
  }

  // 確認
  const checkOrder = () =>{
    console.log('isOrderData',isOrderData)
    const updateData = {
      ...isOrderData,
      orderstate: isState,
    }
    updateOrder(updateData)
  }
  // loading
  if(loadingState){
    return <Loading loadingText='更新中...請稍候'/>
  }
  // 錯誤訊息
  if (error) {
    return <div className="error text-center py-36">{error}</div>
  }
  // 載入前
  if (!isOrderData || !isOrderData.items) {
    return <div className='text-center py-24 text-gray-400'>載入中...</div>
  }

  return (
    <div className="w-[90%] m-auto">
      {}
      <h2 className="text-2xl font-bold mb-7">訂單詳細資訊</h2>
      <div>
        <div className="mb-7">
          <h4 className="text-zinc-500 font-bold ">品項</h4>
          <ul className="order-product">
            {isOrderData.items.map(item => (
              <li className="border-b py-4 mb-3" key={item.id}>
                <div className="flex w-full">
                  <div className="img-photo">
                    <img src={item.imageUrl} alt={item.title} />
                  </div>
                  <div className="w-[calc(100%-120px)]">
                    <h3>{item.title}</h3>
                    <span><h4 className="inline">價格:</h4>$NT {item.price}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <ul className="order-detail flex w-full flex-wrap mb-7">
          <li>
            <h4>姓名</h4>
            <p>{isOrderData.name}</p>
          </li>
          <li>
            <h4>購買時間</h4>
            <p>{`${new Date(isOrderData.time).getFullYear().toString()}.${(new Date(isOrderData.time).getMonth() + 1).toString()}.${new Date(isOrderData.time).getDate().toString()}`}</p>
          </li>
          <li>
            <h4>電話</h4>
            <p>{isOrderData.phone}</p>
          </li>
          <li>
            <h4>Email</h4>
            <p>{isOrderData.email}</p>
          </li>
          <li>
            <h4>購買數量</h4>
            <p>{isOrderData.totalQuantity} 雙</p>
          </li>
          <li>
            <h4>總金額</h4>
            <p>$NT {isOrderData.totalMoney} 元</p>
          </li>
        </ul>
        <div>
          <h4>訂單狀態</h4>
          <select
            className=' border-gray-200 w-[30%]'
            defaultValue={isState}
            onChange={(e) => setIsState(e.target.value)}
          >
            <option>未處理</option>
            <option>處理中</option>
            <option>已處理</option>
          </select>
          <div className='mt-11 flex justify-center'>
            <button className='addBtn py-2 px-12 mr-3 text-xl' onClick={checkOrder}>確認</button>
            <button className='addBtn deleteBtn py-2 px-12 text-xl' onClick={()=> openDeteleProduct(isOrderData.id,isOrderData.name,'orders')}>刪除</button>
          </div>      
        </div>

      </div>
    </div>
  )
}

export default AdminOrderDetail
