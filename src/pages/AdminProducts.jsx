import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../components/Pagination";
import Search from "../components/Search";
import ProductList from '../components/ProductList'
import { useProductNavigation} from "../components/useProductNavigation";

function AdminOrderProducts(){
  const { openAddProduct } = useProductNavigation()
  const [products,setProducts] = useState([]) //取得資料
  const [filteredProducts,setFilteredProducts] = useState([]) // 篩選用
  const [searchData,setSearchData] = useState(false)
  const [loading,setLoading] = useState(false)
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
    setLoading(true)
    const res = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}allProducts`,
      {
        params: {
          page: page,
          pageSize: pagination.pageSize,
        },
      }
    );
    setProducts(res.data.products)
    setFilteredProducts(res.data.products)

    // 需立即更新
    setPagination({
      ...res.data.pagination,
      currentPage: page,
    })
    setLoading(false)

  }  
  /**
   * 收尋
   */
  const handleSearch = (searchValue) => {
      const filterProduct = [...products].filter((product) => {
      const searchLower = searchValue.toLowerCase()
      return (
        // 搜尋產品名稱
        product.title?.toLowerCase().includes(searchLower) ||

        // 搜尋時間
        product.category?.toString().includes(searchLower) ||

        // 搜尋時間
        product.time?.toString().includes(searchLower) ||
        
        // 收尋金額
        product.price?.toString().includes(searchLower)
      )
    });

    // 篩選後資料
    setFilteredProducts(filterProduct);
    setPagination((prev) => ({
      ...prev,
      totalPages: Math.ceil(filterProduct.length / prev.pageSize), // 取得頁數
      totalProducts: filterProduct.length, // 取得筆數
      currentPage: 1, // 搜尋後從第 1 頁開始
    }));
    console.log('filterProduct',filterProduct)
    if(filterProduct.length === 0){
      setSearchData(true)
    }else{
      setSearchData(false)
    }
  };
  
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
        <h3 className="title-h1 border-b pb-2 mb-6">產品列表</h3>
        {/* 建立新增商品按鈕 */}
        <button type="button" className="addBtn absolute top-0 right-0" onClick={()=>{openAddProduct('create',{})}}>新增內容</button>
      </div>
      {/* 收尋為空值 */}
      {searchData && filteredProducts.length === 0  && <div className="text-gray-500 text-center py-5">無資料，請重新收尋</div>}
      {/* loading */}
      {
        loading ? (
          <div className="text-gray-400 text-center py-5">載入中...請稍候</div>
        ) : 
        (
          <div>
            {/* 列表 */}
            <ProductList source='products' listData={filteredProducts}/>
            {/* 分頁 */}
            <Pagination pagination={pagination} chanegePage={getProducts}/>
          </div>
        ) 
      }
  </div>)
}

export default AdminOrderProducts;