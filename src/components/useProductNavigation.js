import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteMesage,setMessage } from "../slice/messageSlice";


export function useProductNavigation() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const openAddProduct = (type, product) => {
    navigate('/admin/addproduct', { state: { type, productList: product } })
  }

  const openDeteleProduct = (id,title,source) =>{
    dispatch(deleteMesage({
      deleName:source,
      type:"warning",
      actionType: "delete",
      deleteDate: [id,title]
    }))
  }
  return { openAddProduct ,openDeteleProduct }
}


