import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { MessageContext , handleSuccessMessage,handleErrorMessage} from "../../store/messageStore";

// 1.取得欄位資料
// 2.將資料組合成data 
// 3.送api
function ProductModal({closeProductModal,getProducts,type,productList}) {
  //在此用不到 message 將它移除， 但 ',' 必須留下
  const [,dispatch] = useContext(MessageContext)



  const [productData,setProductData] = useState({
    "title": "",
    "category": "",
    "origin_price": 100,
    "price": 100,
    "unit": "個",
    "description": "",
    "content": "",
    "is_enabled": 0,
    "imageUrl": "",
  })

  // 判斷目前 type 如果 create 給予預設值 如果是 edit 將取得的值帶入 setProductData
  useEffect(()=>{
    if(type === 'create'){
      setProductData({
        "title": "",
        "category": "",
        "origin_price": 100,
        "price": 100,
        "unit": "個",
        "description": "",
        "content": "",
        "is_enabled": 0,
        "imageUrl": "",
      })
    }else if(type === 'edit'){
      setProductData(productList);
    }
  },[type,productList])

  // 取欄位值
  const handleChange = (e) =>{
    const {name,value} = e.target
    // includes方法 來查詢的值有沒有包含在陣列裡面
    if(['price','origin_price'].includes(name)){
      setProductData({
        ...productData,
        [name]:Number(value)
      })
    }else if(name === 'is_enabled'){
      setProductData({
        ...productData,
        // 加上一個 + 號來做轉型
        [name]:+e.target.checked, 
      })
    }else{
      setProductData({
        ...productData,
        [name]:value
      })
    }
  }

  const updateFile = async (file) =>{
    console.log(file)
    if(!file) return
    const formData = new FormData()
    formData.append('file-to-upload',file)
    try {
      const res = await axios.post(`/v2/api/${import.meta.env.VITE_APP_API_PATH}/admin/upload`,formData)
      console.log(res)
      const {imageUrl,success} = res.data
      if(success){
        alert('上傳成功')
        productData.imageUrl = imageUrl
      }
    } catch (error) {
      console.log(error)
    }
  }

  //送資料
  //關閉 Modal
  //重新撈取列表 api
  const dataSumit = async () =>{
    let api = `/v2/api/${import.meta.env.VITE_APP_API_PATH}/admin/product`,
        method = 'post'

    if(type === 'edit'){
      api =`/v2/api/${import.meta.env.VITE_APP_API_PATH}/admin/product/${productList.id}`
      method = 'put'
    }

    try {
      const res = await axios[method](api,{'data':productData})
      const {message,success} = res.data
      if(success){
        console.log(res)
        handleSuccessMessage(dispatch, message);
        closeProductModal()
        getProducts()
      }
      
    } catch (error) {
      console.log('error',error)
      handleErrorMessage(dispatch, error);
    }
  }



  return (
  
    <div
      className='modal fade'
      id='isproductModal'
      tabIndex='-1'
      aria-labelledby='exampleModalLabel'
      aria-hidden='true'
    >
     
      <div className='modal-dialog modal-lg'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h1 className='modal-title fs-5' id='exampleModalLabel'>
            {type=== 'create' ? '建立新商品' : `編輯 ${productList.title}`}
              
            </h1>
            <button
              type='button'
              className='btn-close'
              aria-label='Close'
              onClick={closeProductModal}
            />
          </div>
          <div className='modal-body'>
            <div className='row'>
              <div className='col-sm-4'>
                <div className='form-group mb-2'>
                  <label className='w-100' htmlFor='image'>
                    輸入圖片網址
                    <input
                      type='text'
                      name='imageUrl'
                      id='image'
                      placeholder='請輸入圖片連結'
                      className='form-control'
                      onChange={handleChange}
                      value={productData.imageUrl}
                    />
                  </label>
                </div>
                <div className='form-group mb-2'>
                  <label className='w-100' htmlFor='customFile'>
                    或 上傳圖片
                    <input
                      type='file'
                      name="file-to-upload"
                      id='customFile'
                      className='form-control'
                      onChange={(e)=> {updateFile(e.target.files[0])}}
                    />
                  </label>
                </div>
                <img src="" alt='' className='img-fluid' />
              </div>
              <div className='col-sm-8'>
             
                <div className='form-group mb-2'>
                {/* 可用 pre 標籤 測試值是否有正確取得 */}
                {/* <pre>{JSON.stringify(productData)}</pre> */}
                  <label className='w-100' htmlFor='title'>
                    標題
                    <input
                      type='text'
                      id='title'
                      name='title'
                      placeholder='請輸入標題'
                      className='form-control'
                      onChange={handleChange}
                      value={productData.title}
                    />
                  </label>
                </div>
                <div className='row'>
                  <div className='form-group mb-2 col-md-6'>
                    <label className='w-100' htmlFor='category'>
                      分類
                      <input
                        type='text'
                        id='category'
                        name='category'
                        placeholder='請輸入分類'
                        className='form-control'
                        onChange={handleChange}
                        value={productData.category}
                      />
                    </label>
                  </div>
                  <div className='form-group mb-2 col-md-6'>
                    <label className='w-100' htmlFor='unit'>
                      單位
                      <input
                        type='unit'
                        id='unit'
                        name='unit'
                        placeholder='請輸入單位'
                        className='form-control'
                        onChange={handleChange}
                        value={productData.unit}
                      />
                    </label>
                  </div>
                </div>
                <div className='row'>
                  <div className='form-group mb-2 col-md-6'>
                    <label className='w-100' htmlFor='origin_price'>
                      原價
                      <input
                        type='number'
                        id='origin_price'
                        name='origin_price'
                        placeholder='請輸入原價'
                        className='form-control'
                        onChange={handleChange}
                        value={productData.origin_price}
                      />
                    </label>
                  </div>
                  <div className='form-group mb-2 col-md-6'>
                    <label className='w-100' htmlFor='price'>
                      售價
                      <input
                        type='number'
                        id='price'
                        name='price'
                        placeholder='請輸入售價'
                        className='form-control'
                        onChange={handleChange}
                        value={productData.price}
                      />
                    </label>
                  </div>
                </div>
                <hr />
                <div className='form-group mb-2'>
                  <label className='w-100' htmlFor='description'>
                    產品描述
                    <textarea
                      type='text'
                      id='description'
                      name='description'
                      placeholder='請輸入產品描述'
                      className='form-control'
                      onChange={handleChange}
                      value={productData.description}
                    />
                  </label>
                </div>
                <div className='form-group mb-2'>
                  <label className='w-100' htmlFor='content'>
                    說明內容
                    <textarea
                      type='text'
                      id='content'
                      name='content'
                      placeholder='請輸入產品說明內容'
                      className='form-control'
                      onChange={handleChange}
                      value={productData.content}
                    />
                  </label>
                </div>
                <div className='form-group mb-2'>
                  <div className='form-check'>
                    <label
                      className='w-100 form-check-label'
                      htmlFor='is_enabled'
                    >
                      是否啟用
                      <input
                        type='checkbox'
                        id='is_enabled'
                        name='is_enabled'
                        placeholder='請輸入產品說明內容'
                        className='form-check-input'
                        onChange={handleChange}
                        // Boolean(productData.is_enabled) 布林值轉換 或是 可以用 ！ 他會從真值變成假值，如果是兩個!! 他的概念跟布林值轉換是一樣的
                        checked={!!productData.is_enabled}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='modal-footer'>
            <button type='button' className='btn btn-secondary' onClick={closeProductModal}>
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

export default ProductModal;


