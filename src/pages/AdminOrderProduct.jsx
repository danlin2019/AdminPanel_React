import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import Pagination from "../components/admin/Pagination";
import Search from "../components/admin/Search";
import { deleteMesage } from "../slice/messageSlice";

function AdminOrderProducts(){
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [products,setProducts] = useState([]) //取得資料
  const [filteredProducts,setFilteredProducts] = useState([]) // 篩選用\
  const [listHint,setListHint] = useState(false)
  const [hintText,setHintText] = useState('')

  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    hasNext: false,
    hasPrev: false,
    totalPages: 0,
    totalProducts: 0,
  });

  useEffect(()=>{
    getProducts()
  },[])

  //取的 產品列表 api
  const getProducts = async (page = 1)=>{
    const res = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}allProducts`,
      {
        params: {
          page: page,
          pageSize: pagination.pageSize,
        },
      }
    );
    console.log('res.data.products',res.data.products)
    setProducts(res.data.products)
    setFilteredProducts(res.data.products)
    // 需立即更新
    setPagination({
      ...res.data.pagination,
      currentPage: page,
    });

    console.log('res.data.products.length',res.data.products.length)
    if(res.data.products.length !== 0){
      setHintText('資料讀取中')
    }else{
      setListHint(true)
      setHintText('目前尚無資料')
    }
    console.log('ListHint',listHint)
    console.log('HintText',hintText)
  }  

  //openAddProduct 新增 & 修改資料
  const openAddProduct = (type,product) =>{
    console.log("跳轉類型:", type, "產品資料:", product);
    navigate('/admin/addproduct',{state:{type,productList:product}})
  }

  //openDeteleProduct 刪除
  const openDeteleProduct = (id,title) =>{
    dispatch(deleteMesage({
      type:"warning",
      actionType: "delete",
      deleteDate: [id,title]
    }))
  }
  /**
   * 收尋
   * @param {any} searchValue 
   * @param {boolean} ascending 
   * 用取得的資料來跟 searchValue 做篩選
   * 篩選出來結果後 需要重新再設定一次頁數
   * 用title做篩選 
   * includes 檢視裡是否有包含 searchValue 的字串 
   * toLowerCase來轉換成小寫，避免大小寫影響搜尋結果
   */
  const handleSearch = (searchValue) =>{
      // 進行篩選和排序
      const filterProduct = [...products]
          .filter( product => product.title.toLowerCase().includes(searchValue.toLowerCase()))
      // 篩選後資料
      setFilteredProducts(filterProduct)
      setPagination((prev) => ({
        ...prev,
        totalPages: Math.ceil(filterProduct.length/prev.pageSize), // 取得頁數  篩選出來的數量 / 資料筆數並轉成整數
        totalProducts: filterProduct.length,  // 取得筆數
        currentPage: 1, // 搜尋後從第 1 頁開始
      }))
  }
  /**
   * 排序
   * @param {boolean} ascending 
   * @param {string} sort 
   */
  const handSortItem = (ascending, sort) =>{
    const sortProduct = [...filteredProducts].sort((a,b)=>{
        if(sort === 'createdAt') {
          return ascending ? 
          a?.createdAt?._seconds - b?.createdAt?._seconds : 
          b?.createdAt?._seconds - a?.createdAt?._seconds
        }
        if(sort === 'price'){
          return ascending ? a.price - b.price :  b.price - a.price
        }
    })
    setFilteredProducts(sortProduct)
  } 

  return(
  <div className="w-[90%] m-auto ">
    <Search getProducts = {getProducts} handleSearch = {handleSearch}  handSortItem = {handSortItem}/>
    <div className="relative"> 
      <h3 className="title-h1 border-b pb-2 mb-6">訂單列表</h3>
      {/* 建立新增商品按鈕 */}
      <button type="button" className="addBtn absolute top-0 right-0" onClick={()=>{openAddProduct('create',{})}}>新增內容</button>
    </div>
   
    <table className="w-full text-left mb-7">
      <thead>
        <tr>
          <th>分類</th>
          <th>名稱</th>
          <th>售價</th>
          <th>上架時間</th>
          <th className="w-[5%] text-right">編輯</th>
        </tr>
      </thead>
      <tbody>
      {filteredProducts.map((product)=>{
        return (
          <tr key={product.id} className="w-full border-b-2">
            <td>{product.category}</td>
            <td className="w-[60%] max-w-3">{product.title}</td>
            <td>{product.price}</td>
            <td>{`${new Date(product.time).getFullYear().toString()}.${(new Date(product.time).getMonth()+1).toString()}.${new Date(product.time).getDate().toString()}`}</td>
            <td className="w-[15%] text-right space-y-3">
              <button
                type="button"
                className="addBtn mr-1"
              onClick={()=>{openAddProduct('edit',product)}}
              >
                編輯
              </button>
              <button
                type="button"
                className="addBtn deleteBtn"
                onClick={()=>{openDeteleProduct(product.id,product.title)}}
              >
                刪除
              </button>
            </td>
          </tr>
        )
      })}

      </tbody>
    </table>
    {listHint && ( <span className="text-center block text-[#ccc] py-3" dangerouslySetInnerHTML={{ __html: hintText }}></span>)}
    {/* 分頁 */}
    <Pagination pagination={pagination} chanegePage={getProducts}/>
  </div>)
}

export default AdminOrderProducts;