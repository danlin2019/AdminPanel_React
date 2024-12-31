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
  const [updateImg,setUpdateImg] = useState('')
  const [editorContent, setEditorContent] = useState(''); // 編輯器內容
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
  const handleEditorChange = (event, editor) =>{
    const data = editor.getData(); // 獲取編輯器的內容
    console.log("CKEditor內容：", data); // 確認內容
    setEditorContent(data);
  }

  // 處理提交
  const handleSubmit = async () => {
    productData.content = editorContent
    console.log("最終提交的資料：", productData);
    const payload = { ...productData };
    let api = `${import.meta.env.VITE_APP_API_URL}addProduct`;
    let method = "post";

    if (type === "edit") {
      api = `${import.meta.env.VITE_APP_API_URL}/editProduct`;
      method = "patch";
      delete payload.createdAt;
    } else {
      payload.createdAt = new Date().toISOString();
    }

    try {
      const res = await axios[method](api, payload);
      const { success } = res.data;
      if (success) {
        dispatch(
          setMessage({
            type: "success",
            actionType: msg,
          })
        );
      }
    } catch (error) {
      dispatch(
        setMessage({
          type: "error",
          actionType: msg,
        })
      );
      console.error("提交失敗：", error.message);
    }
  };
  

  // 圖片上傳處理
 const handleImageUpload = (e) => {
  const file = e.target.files[0];
  console.log(file)
  if (!file) return;
  setUpdateImg(file.name)
  setUploading(true);
  const storageRef = ref(storage, `images/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // // 可選：上傳進度
      // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      // console.log("Upload is " + progress + "% done");
     
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
    <div className="p-3 w-[90%] m-auto">
      <h2 className="title-h1 border-b pb-2 mb-6">
        {type === "create" ? "新增" : "修改"}商品
      </h2>
     
      <ul className="add-input-box mb-6">
        <li>
          <label htmlFor="image" className="relative">
            <input
              className="input-style addInpiut opacity-0 absolute cursor-pointer"
              type="file" 
              accept="image/gif, image/jpeg, image/png"
              id="image"
              name="image"
              placeholder="上傳圖片"
              onChange={handleImageUpload}
              value={updateImg.file}
            />
          
            <button className="addBtn w-32 py-2 mr-2">{updateImg ? '重新上傳' : '圖片上傳'}</button>
            <span> {updateImg !== '' ? `檔案名稱：${updateImg}` : ''}</span>
           
          </label>
        </li>
        <li>
          <h4>標題：</h4>
          <label htmlFor="title">
            <input
              className="input-style addInpiut"
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
        <h4>上架時間：</h4>
        <DatePicker
          className="input-style addInpiut"
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
          <h4>分類：</h4>
          <label htmlFor="category">
            <input
              className="input-style addInpiut"
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
          <h4>原價：</h4>
          <label htmlFor="origin_price">
            <input
              className="input-style addInpiut"
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
          <h4>價格：</h4>
          <label htmlFor="price">
            <input
              className="input-style addInpiut"
              type="number"
              id="price"
              name="price"
              placeholder="請輸入價格"
              onChange={handleChange}
              value={productData.price}
            />
          </label>
        </li>
      </ul>
      <div className="editor-container">
        <CKEditor
          className=" min-h-[300px]"
          editor={ClassicEditor}
          config={{
            licenseKey: import.meta.env.VITE_APP_CKE,
          }}
          data={productData.content || '<p>請輸入文字</p>'}
          onChange={handleEditorChange}
        />
      </div>
      <button type="button" className="addBtn mt-6 py-2 w-32" onClick={handleSubmit}>
        {type === "create" ? "新增" : "修改"}商品
      </button>
    </div>
  );
}

export default AdminAdProduct;