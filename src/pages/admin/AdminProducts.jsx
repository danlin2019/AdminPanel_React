import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2'

import Pagination from "../../components/admin/Pagination";

function AdminProducts(){
  const navigate = useNavigate()
  const [products,setProducts] = useState([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    hasNext: false,
    hasPrev: false,
    totalPages: 0,
    lastDocId: null,
  });



  useEffect(()=>{
    getProducts()
  },[])


  //取的 產品列表 api
  const getProducts = async (page)=>{
    const startAfter = page === 1 ? "" : pagination.lastDocId;
    const res = await axios.get(
      `https://us-central1-car-project-b8e4e.cloudfunctions.net/getProductList`,
      {
        params: {
          page: page,
          pageSize: pagination.pageSize,
          startAfter: startAfter,
        },
      }
    );
    
    setProducts(res.data.products);
    console.log('products',res.data.products)
    // 需立即更新
    setPagination({
      ...res.data.pagination,
      currentPage: page,
      lastDocId: res.data.pagination.lastDocId || null, // 更新新的 lastDocId
    });
    console.log('產品',res)
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



  

  return(
  <div className="p-3">
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
      {products.map((product)=>{
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