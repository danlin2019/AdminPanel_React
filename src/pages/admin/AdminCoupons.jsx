import { useEffect, useRef, useState } from "react";
import axios from "axios";
import CouponModal from "../../components/admin/CouponModal";
import DeleteModal from "../../components/admin/DeleteModal";
import Pagination from "../../components/admin/Pagination";


function AdminCoupons(){
  const [coupon,setCoupons] = useState([])
  const [pagination,setPagination] = useState({})

  //type 決定 modal 展開的用塗 create 是編輯 edit是新增
  const [type,setType] = useState('create')

  //編輯的時候要先把商品暫存進去，會需要一個暫存的欄位，取得當筆資料
  const [productList,setProductList] = useState({})


  const couponmodal = useRef(null)
  const deletemodal = useRef(null)
  useEffect(()=>{
    // static 點擊外面無法關閉
    couponmodal.current = new Modal(document.getElementById('couponModal'),{
      backdrop: 'static', // 設定靜態 backdrop
    });

    deletemodal.current = new Modal(document.getElementById('deleteModal'),{
      backdrop: 'static', // 設定靜態 backdrop
    });

    getCoupons()
  },[])

  //取的 產品列表 api
  const getCoupons = async (page = 1)=>{
    const productRes = await axios.get(`/v2/api/${import.meta.env.VITE_APP_API_PATH}/admin/coupons?page=${page}`)
    const {coupons,pagination} = productRes.data
    setCoupons(coupons)
    setPagination(pagination)
    console.log('優惠卷',productRes)
  }  

  // 打開 Modal
  const openCouponModal = (type,product) =>{
    couponmodal.current.show()
    setType(type)
    setProductList(product)
  }
  // 關閉 Modal
  const closeModal = () =>{
    couponmodal.current.hide()
  }
  // 開啟 Detele Modal
  const openDeteleCouponModal = (product) =>{
    deletemodal.current.show()
    setProductList(product)
  }
  // 關閉 Detele Modal
  const closeDeteleCouponModal = () =>{
    deletemodal.current.hide()
  }

  //刪除資料
  const deleteProduct = async (id) =>{
    try {
      console.log(id)
      const res = await axios.delete(`/v2/api/${import.meta.env.VITE_APP_API_PATH}/admin/coupon/${id}`)
      console.log(res)
      const {success,message} = res.data
      if(success){
        alert(message)
        getCoupons()
        deletemodal.current.hide()
      }

    } catch (error) {
      console.log(error)
    }
  }

  

  return(
  <div className="p-3">
    <CouponModal closeCouponModal={closeModal} getProducts={getCoupons} type={type} productList={productList}/>
    <DeleteModal close={closeDeteleCouponModal} text={productList.title} deleteClick={deleteProduct} id={productList.id}/>
    <h3>優惠卷列表</h3>
    <hr />
    <div className="text-end">
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={()=>{openCouponModal('create',{})}}
      >
        建立優惠卷
      </button>
    </div>
    <table className="table">
      <thead>

        <tr>
          <th scope="col">標題</th>
          <th scope="col">折扣</th>
          <th scope="col">到期日</th>
          <th scope="col">優惠碼</th>
          <th scope="col">編輯</th>
        </tr>
      </thead>
      <tbody>
      {coupon.map((items)=>{
        return (<tr key={items.id}>
          <td>{items.title}</td>
          <td>{items.percent}</td>
          {/* 之後需要優化 */}
          <td>{new Date(items.due_date).toDateString()}</td> 
          <td>{items.is_enabled ? '啟用' : '未啟用'}</td>
          <td>
            <button
              type="button"
              className="btn btn-primary btn-sm"
             onClick={()=>{openCouponModal('edit',items)}}
            >
              編輯
            </button>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm ms-2"
              onClick={()=>{openDeteleCouponModal(items)}}
            >
              刪除
            </button>
          </td>
        </tr>)
      })}

      </tbody>
    </table>
    {/* 分頁 */}
    <Pagination pagination={pagination} chanegePage={getCoupons}/>
  </div>)
}

export default AdminCoupons;