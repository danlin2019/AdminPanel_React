import { useEffect, useState,useRef } from "react";
import { useLocation } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import Swal from 'sweetalert2'

function AdminAdProduct() {
  const location = useLocation();
  const { type, productList } = location.state || { type: "create", productList: {} };
console.log('location.state',location.state)
  // 狀態管理
  const [content, setContent] = useState(""); // 編輯器內容

  const [productData, setProductData] = useState({
    title: "",
    category: "",
    origin_price: 100,
    price: 100,
    unit: "個",
    description: "1",
    content: "",
    is_enabled: 0,
    // imageUrl: "",
  });


  // 判斷當前類型並設置初始資料
  useEffect(() => {
    
    if (type === "create") {
      setProductData({
        title: "",
        category: "",
        origin_price: 100,
        price: 100,
        unit: "1個",
        // description: "",
        content: "",
        is_enabled: 0,
        // imageUrl: "",
      });
    } else if (type === "edit") {
      setProductData(productList);
    }
  }, [type, productList]);

  // 處理表單變更
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: name === "origin_price" || name === "price" ? Number(value) : value,
    });
  };

  // 處理編輯器內容變更
  const handleEditorChange = (event, editor) => setContent(editor.getData());

  // 處理提交
  const handleSubmit = async () => {
    productData.content = content
    console.log("提交的商品資料：", productData,new Date().toISOString());

    let api = 'https://us-central1-car-project-b8e4e.cloudfunctions.net/addProduct',
        method = 'post'

    console.log('type',type)

    const payload = {...productData}
    if(type === 'edit'){
      api = 'https://us-central1-car-project-b8e4e.cloudfunctions.net/editProduct',
      method = 'patch'
      // 刪除時間
      delete payload.createdAt
    }else{
      // 新增模式，才加上 createdAt
      payload.createdAt = new Date().toISOString()
    }

    try {
      const res = await axios[method](api,payload)
      console.log("提交成功：", res);
    } catch (error) {
      console.error("提交失敗：", error.message);
    }
  };

  return (
    <div className="p-3">
      <ul>
        <li>
          <label htmlFor="title">
            <input
              type="text"
              id="title"
              name="title"
              placeholder="請輸入標題"
              onChange={handleChange}
              value={productData.title}
            />
          </label>
        </li>
        <li>
          <label htmlFor="category">
            <input
              type="text"
              id="category"
              name="category"
              placeholder="請輸入分類"
              onChange={handleChange}
              value={productData.category}
            />
          </label>
        </li>
        <li>
          <label htmlFor="origin_price">
            <input
              type="number"
              id="origin_price"
              name="origin_price"
              placeholder="請輸入原價"
              onChange={handleChange}
              value={productData.origin_price}
            />
          </label>
        </li>
        <li>
          <label htmlFor="price">
            <input
              type="number"
              id="price"
              name="price"
              placeholder="請輸入價格"
              onChange={handleChange}
              value={productData.price}
            />
          </label>
        </li>
        <li>
          <label htmlFor="unit">
            <input
              type="text"
              id="unit"
              name="unit"
              placeholder="請輸入單位"
              onChange={handleChange}
              value={productData.unit}
            />
          </label>
        </li>
      </ul>
      <div className="editor-container">
        <CKEditor
          editor={ClassicEditor}
          config={{
            licenseKey: "eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3MzU2MDMxOTksImp0aSI6IjU1YWMxNjg4LWI1YjAtNDg3NC1iNWQ2LTM4N2ViMGMyZjliNiIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjRmMDk0MDBhIn0.XijNlhhEoLC7XuouFsB3TjUiyVkc98iotVLY06eB1jRMxZ2ouy3GZU8uBw2KZx77VfdvxNT0NeuXN0QbPOQ1Ow", // 替換為您的 License Key
          }}
          data={productData.content || '<p>請輸入文字</p>'}
          onChange={handleEditorChange}
        />
        {/* <div dangerouslySetInnerHTML={{ __html: content }} /> */}
      </div>
      <button type="button" onClick={handleSubmit}>
        {type === "create" ? "新增" : "修改"}商品
      </button>
    </div>
  );
}

export default AdminAdProduct;
