import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import { useEffect, useState,useRef } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { setMessage } from "../slice/messageSlice";

function AdminAdProduct() {
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch()
  const [msg,setMsg] = useState('')

  const { type, productList } = location.state || { type: "create", productList: {} }

  // 狀態管理
  const [editorContent, setEditorContent] = useState(""); // 編輯器內容
  const [productData, setProductData] = useState({
    title: "",
    category: "",
    origin_price: 100,
    price: 100,
    unit: "個",
    content: "",
    is_enabled: 0,
    time: '',
    imageUrl: "",
  });


  // 
  /**
   * 判斷當前類型並設置初始資料
   * @param {string} create 
   * @param {string} edit 
   */
  useEffect(() => {
    if (type === "create") {
      setProductData({
        title: "",
        category: "",
        origin_price: 100,
        price: 100,
        unit: "1個",
        content: "",
        is_enabled: 0,
        time: new Date().getTime(),
        imageUrl: "",
      });
      setMsg('create')
    } else if (type === "edit") {
      setProductData(productList);
      setSelectedDate(productList.time || new Date().getTime())
      setMsg('edit')
    }
  }, [type, productList]);

  // 處理表單變更
  const handleChange = (e) => {
    const { name, value } = e.target;
    if(['origin_price','price'].includes(name)){
      setProductData({
        ...productData,
        [name]: Number(value),
      });
    }else if(name === 'time'){
      console.log(value)
      setProductData({
        ...productData,
        [name]: value,
      });
      setSelectedDate(new Date(value))
    }else{
      setProductData({
        ...productData,
        [name]: value,
      });
    }

  };

  // 處理編輯器內容變更
  const handleEditorChange = (event, editor) => setEditorContent(editor.getData());

  // 處理提交
  const handleSubmit = async () => {
    const payload = {...productData}
    productData.content = editorContent

    console.log("提交的商品資料：", productData)
    let api = `${import.meta.env.VITE_APP_API_URL}addProduct`,
        method = 'post'
        
    if(type === 'edit'){
     
      api = `${import.meta.env.VITE_APP_API_URL}/editProduct`,
      method = 'patch'
      // 刪除時間
      delete payload.createdAt
    }else{
     
      // 新增模式，加上 createdAt
      payload.createdAt = new Date().toISOString()
    }
    console.log('msg',msg)
    try {
      const res = await axios[method](api,payload)
      const {success} =  res.data
      if(success){
        dispatch(setMessage({
          type: "success",
          actionType: msg,
        }))
      }

    } catch (error) {
      dispatch(setMessage({
        type: "error",
        actionType: msg,
      }))
      console.error("提交失敗：", error.message);
    }
  };

  // 圖片上傳處理
 const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setUploading(true);
  const storageRef = ref(storage, `images/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // 可選：上傳進度
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
    },
    (error) => {
      console.error("上傳失敗：", error);
      setUploading(false);
    },
    async () => {
      // 上傳完成
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      console.log("圖片下載網址：", downloadURL);
      setProductData((prev) => ({ ...prev, imageUrl: downloadURL }));
      setUploading(false);
    }
  );
};

  return (
    <div className="p-3">
      <ul>
        <li>
          <label htmlFor="image">
            <input
              type="file" 
              accept="image/gif, image/jpeg, image/png"
              id="image"
              name="image"
              placeholder="上傳圖片"
              onChange={handleImageUpload}
            />
          </label>
        </li>
        <li>
        <DatePicker
          selected={selectedDate}
          onChange={(date) =>{
            handleChange({
              target:{
                name:'time',
                value: date.getTime()
              }
            })
          }}
          name="time"
          placeholderText="請選擇日期與時間"
          value={productData.time}
        />


        </li>
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
          data={productData.editorContent || '<p>請輸入文字</p>'}
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
