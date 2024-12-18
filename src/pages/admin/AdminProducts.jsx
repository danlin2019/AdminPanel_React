import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2'

import Pagination from "../../components/admin/Pagination";
import Search from "../../components/admin/Search";

function AdminProducts(){
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
      `https://us-central1-car-project-b8e4e.cloudfunctions.net/allProducts`,
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
    });
    console.log('產品',res,pagination)
  }  

  //openAddProduct 新增 & 修改資料
  const openAddProduct = (type,product) =>{
    console.log("跳轉類型:", type, "產品資料:", product);
    navigate('/admin/addproduct',{state:{type,productList:product}})
  }

  //openDeteleProduct 刪除
  const openDeteleProduct = (id) =>{
    console.log('delete' ,id)
    Swal.fire({
      title: "確定要刪除嗎？",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "確認刪除",
      cancelButtonText:"取消"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProduct(id)
          .then(()=>{
            Swal.fire({
              title: "資料已刪除!",
              icon: "success",
              confirmButtonText: "確認",
            }).then(()=>{
              window.location.reload()
            })
          })
          .catch((error)=>{
            Swal.fire({
              title: error,
              icon: "error",
              text: "發生錯誤，請稍後再試。",
            });
          })


      }
    });
  }

  const deleteProduct = async (id) =>{
    const res = await axios.delete(`https://us-central1-car-project-b8e4e.cloudfunctions.net/deleteProduct?id=${id}`)
    console.log(res)
  }

  // 收尋
  const handleSearch = (searchValue) =>{
    console.log('searchValue',searchValue)
    console.log('products',products)
    // 用取得的資料來跟 searchValue 做篩選
    // 篩選出來結果後 需要重新再設定一次頁數
    const filterData = products.filter((product)=>{
      return product.title.toLowerCase().includes(searchValue.toLowerCase())
    })
    
    setFilteredProducts(filterData)
    
    setPagination((prev) => (
      console.log('filterData',filterData,filterData.length , prev.pageSize),
      {
      ...prev,
      totalPages: Math.ceil(filterData.length/prev.pageSize),
      totalProducts: filterData.length,
      currentPage: 1, // 搜尋後從第 1 頁開始
      hasNext: false, // 搜尋結果只有一頁時，沒有下一頁
      hasPrev: false, // 搜尋結果只有一頁時，沒有上一頁
    }))

  }

  

  return(
  <div className="p-3">
    <Search getProducts = {getProducts} handleSearch = {handleSearch}/>
    <h3>產品列表</h3>
    <hr />
    {/* 建立新增商品按鈕 */}
    <button
      type="button"
      onClick={()=>{openAddProduct('create',{})}}
     >真正的新增內容按鈕</button>

    <table className="table">
      <thead>

        <tr>
          <th scope="col">分類</th>
          <th scope="col">名稱</th>
          <th scope="col">售價</th>
          <th scope="col">啟用狀態</th>
          <th scope="col">編輯</th>
        </tr>
      </thead>
      <tbody>
      {filteredProducts.map((product)=>{
        return (<tr key={product.id}>
          <td>{product.category}</td>
          <td>{product.title}</td>
          <td>{product.price}</td>
          <td>{product.is_enabled ? '啟用' : '未啟用'}</td>
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
              onClick={()=>{openDeteleProduct(product.id)}}
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