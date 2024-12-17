import { useEffect, useState } from "react";
import axios from "axios";

// 1.取得欄位資料
// 2.將資料組合成data 
// 3.送api
//api時間欄位需求，需要轉成 unix timeStamp
function CouponModal({closeCouponModal,getProducts,type,productList}) {
  const [couponData,setCouponData] = useState({
    "title": "",
    "is_enabled": 1,
    "percent": 10,
    "due_date": 1555459200, 
    "code": "testCode"
  })

  // 建立時間格式
  const [date,setDate] = useState(new Date())
  
  // 判斷目前 type 如果 create 給予預設值 如果是 edit 將取得的值帶入 setCouponData
  // 新增優惠卷的時間是今天 編輯是資料傳進來的時間
  useEffect(()=>{
    if(type === 'create'){
      setCouponData({
        "title": "",
        "is_enabled": 1,
        "percent": 10,
        "due_date": 1555459200,
        "code": "testCode"
      })
      setDate(new Date())
    }else if(type === 'edit'){
      setCouponData(productList);
      setDate(new Date(productList.due_date))
    }
  },[type,productList])

  // 取欄位值
  const handleChange = (e) =>{
    console.log(e)
    const {name,value} = e.target
    // includes方法 來查詢的值有沒有包含在陣列裡面
    if(['due_date','percent'].includes(name)){
      setCouponData({
        ...couponData,
        [name]:Number(value)
      })
    }else if(name === 'is_enabled'){
      setCouponData({
        ...couponData,
        // 加上一個 + 號來做轉型
        [name]:+e.target.checked, 
      })
    }else{
      setCouponData({
        ...couponData,
        [name]:value
      })
    }
  }

  //送資料
  //關閉 Modal
  //重新撈取列表 api
  const dataSumit = async () =>{
    let api = `/v2/api/${import.meta.env.VITE_APP_API_PATH}/admin/coupon`,
        method = 'post'

    if(type === 'edit'){
      api =`/v2/api/${import.meta.env.VITE_APP_API_PATH}/admin/coupon/${productList.id}`
      method = 'put'
    }

    try {
      const res = await axios[method](api,{'data':{
        ...couponData,
        due_date: date.getTime(), //轉成 unix timeStamp
      }})
      const {message,success} = res.data
      if(success){
        alert(message)
        closeCouponModal()
        getProducts()
      }
      
    } catch (error) {
      console.log('error',error)
    }
  }



  return (
  
    <div
      className='modal fade'
      id='couponModal'
      tabIndex='-1'
      aria-labelledby='exampleModalLabel'
      aria-hidden='true'
    >
     
      <div className='modal-dialog modal-lg'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h1 className='modal-title fs-5' id='exampleModalLabel'>
            {type=== 'create' ? '建立優惠卷' : `編輯 ${productList.title}`}
              
            </h1>
            <button
              type='button'
              className='btn-close'
              aria-label='Close'
              onClick={closeCouponModal}
            />
          </div>
          <div className='modal-body'>
            <pre>{JSON.stringify(couponData)}</pre>
            <div className='mb-2'>
              <label className='w-100' htmlFor='title'>
                標題
                <input
                  type='text'
                  id='title'
                  placeholder='請輸入標題'
                  name='title'
                  className='form-control mt-1'
                  onChange={handleChange}
                  value={couponData.title}
                />
              </label>
            </div>
            <div className='row'>
              <div className='col-md-6 mb-2'>
                <label className='w-100' htmlFor='percent'>
                  折扣（%）
                  <input
                    type='text'
                    name='percent'
                    id='percent'
                    placeholder='請輸入折扣（%）'
                    className='form-control mt-1'
                    onChange={handleChange}
                    value={couponData.percent}
                  />
                </label>
              </div>
              <div className='col-md-6 mb-2'>
                <label className='w-100' htmlFor='due_date'>
                  到期日
                  <input
                    type='date'
                    id='due_date'
                    name='due_date'
                    placeholder='請輸入到期日'
                    className='form-control mt-1'
                    value={`${date.getFullYear().toString()}-${(date.getMonth()+1).toString().padStart(2,0)}-${date.getDate().toString().padStart(2,0)}`}
                    onChange={(e)=>{
                      setDate(new Date(e.target.value))
                    }}
                  />
                </label>
              </div>
              <div className='col-md-6 mb-2'>
                <label className='w-100' htmlFor='code'>
                  優惠碼
                  <input
                    type='text'
                    id='code'
                    name='code'
                    placeholder='請輸入優惠碼'
                    className='form-control mt-1'
                    onChange={handleChange}
                    value={couponData.code}
                  />
                </label>
              </div>
            </div>
            <label className='form-check-label' htmlFor='is_enabled'>
              <input
                className='form-check-input me-2'
                type='checkbox'
                id='is_enabled'
                name='is_enabled'
                onChange={handleChange}
                value={couponData.is_enabled}
              />
              是否啟用
            </label>
          </div>

          <div className='modal-footer'>
            <button type='button' className='btn btn-secondary' onClick={closeCouponModal}>
              關閉
            </button>
            <button type='button' className='btn btn-primary' onClick={dataSumit}>
              儲存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CouponModal;