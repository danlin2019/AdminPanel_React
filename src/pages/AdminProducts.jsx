import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import Pagination from "../components/admin/Pagination";
import Search from "../components/admin/Search";
import { deleteMesage } from "../slice/messageSlice";

function AdminProducts(){
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [products,setProducts] = useState([]) //取得資料
  const [filteredProducts,setFilteredProducts] = useState([]) // 篩選用

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
  <div className="p-3">

    <Search getProducts = {getProducts} handleSearch = {handleSearch}  handSortItem = {handSortItem}/>
    <h3>產品列表</h3>
    <hr />
    {/* 建立新增商品按鈕 */}
    <button
      type="button"
      onClick={()=>{openAddProduct('create',{})}}
     >新增內容</button>

    <table className="table">
      <thead>
        <tr>
          <th scope="col">名稱</th>
          <th scope="col">售價</th>
          <th scope="col">啟用狀態</th>
          <th scope="col">時間</th>
        </tr>
      </thead>
      <tbody>
      {filteredProducts.map((product)=>{
        return (<tr key={product.id}>
          <td>{product.title}</td>
          <td>{product.price}</td>
          <td>{`${new Date(product.time).getFullYear().toString()}.${(new Date(product.time).getMonth()+1).toString()}.${new Date(product.time).getDate().toString()}`}</td>
          <td>
            <button
              type="button"
              className="btn btn-primary btn-sm"
             onClick={()=>{openAddProduct('edit',product)}}
            >
              編輯
            </button>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm ms-2"
              onClick={()=>{openDeteleProduct(product.id,product.title)}}
            >
              刪除
            </button>
          </td>
        </tr>)
      })}

      </tbody>
    </table>
    {/* 分頁 */}
    <Pagination pagination={pagination} chanegePage={getProducts}/>
  </div>)
}

export default AdminProducts;