import { FaTrashCan } from "react-icons/fa6"
import { useEffect, useState } from "react"
import { Link,useNavigate } from "react-router-dom"
import { useProductNavigation } from "./useProductNavigation"

const ProductList = ({ source, listData }) => {

  const [productTh, setProductTh] = useState([]);
  const { openAddProduct,openDeteleProduct } = useProductNavigation()
  useEffect(() => {
    if (source === "orders") {
      setProductTh([
        {
          td: "購買時間",
          w: "10%",
        },
        {
          td: "姓名",
          w: "15%",
        },
        {
          td: "商品",
          w: "15%",
        },
        {
          td: "數量",
          w: "13%",
        },
        {
          td: "金額",
          w: "13%",
        },
        {
          td: "狀態",
          w: "13%",
        },
      
      ])
    }else if(source === 'products'){
      setProductTh([
        {
          td: "分類",
          w: "10%",
        },
        {
          td: "名稱",
          w: "25%",
        },
        {
          td: "售價",
          w: "10%",
        },
        {
          td: "數量",
          w: "10%",
        },
        {
          td: "上架時間",
          w: "10%",
        },
        {
          td: "編輯",
          w: "13%",
        }
      
      ])
    }
  }, [source])

  // 當data沒有資料時
  if(listData.length === 0){
    return (<div className='text-center py-24 text-gray-400'>{`無${source === 'products' ? '產品' : '訂單'}資料...`}</div>)
  }
  return (
    <div>
      <div className="flex justify-between mb-2">
        {productTh.map((items) => {
          return (
            <h2 className={`w-[${items.w}] ${source === "products" ? 'last:text-right' : ''} text-gray-500`} key={items.td}>
              {items.td}
            </h2>
          );
        })}
      </div>
      <ul>
      {source === "products" &&
          listData.map((item) => {
            return ( 
              <li className="relative border-b py-3 mb-5" key={item.id}>
                  <div className="flex justify-between">
                    <div className="w-[10%]">{item.category}</div>
                    <div className="w-[25%]">{item.title}</div>
                    <div className="w-[10%]">$NT {item.price} 元</div>
                    <div className="w-[10%]">{item.unit}雙</div>
                    <div className="w-[10%]">{`${new Date(item.time).getFullYear().toString()}.${(
                        new Date(item.time).getMonth() + 1
                      ).toString()}.${new Date(item.time)
                        .getDate()
                        .toString()}`}</div>
                    <div className="w-[13%] text-right">
                    <button
                      type="button"
                      className="addBtn mr-1"
                      onClick={()=>{openAddProduct('edit',item)}}
                    >
                      編輯
                    </button>
                    
                    <button
                      type="button"
                      className="addBtn deleteBtn"
                      onClick={()=>{openDeteleProduct(item.id,item.title,source)}}
                    >
                      刪除
                    </button>
                    </div>
                  </div>
              
              </li>
            )
          })
        }
        {source === "orders" &&
          listData.map((item) => {
            return ( 
              <li className="relative border-b py-3 mb-5 group transition duration-300 hover:opacity-70" key={item.id}>
                <Link className="" to={{
                    pathname: '/admin/orderdetail',
                    // search: `?q=${item.id}`
                  }}
                  state= {
                    { orderData: item.id }
                  }
                >                    
                  <div className="flex justify-between">
                    <div className="w-[10%]">
                      {`${new Date(item.time).getFullYear().toString()}.${(
                        new Date(item.time).getMonth() + 1
                      ).toString()}.${new Date(item.time)
                        .getDate()
                        .toString()}`}
                    </div>
                    <div className="w-[15%]">{item.name}</div>
                    <div className="w-[15%]">{item.items[0].title}</div>
                    <div className="w-[13%]">{item.totalQuantity} 雙</div>
                    <div className="w-[13%]">$NT {item.totalMoney}</div>
                    <div className="w-[13%]">{item.orderstate ? item.orderstate : '未處理'}</div>
                  </div>
                </Link>
                <div className="hidden group-hover:flex justify-end absolute right-0 top-[50%] -translate-y-2/4 w-[3%] cursor-pointer hover:opacity-70" onClick={()=>openDeteleProduct(item.id,item.name,source)}><FaTrashCan /></div>
              </li>
            )
          })
        }

      </ul>
      
    </div>
  )
};

export default ProductList;
