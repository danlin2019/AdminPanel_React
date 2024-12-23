import { useDispatch ,useSelector } from "react-redux"
import Swal from 'sweetalert2'
import { clearMessage } from "../../slice/messageSlice"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const Notification = () =>{
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {title,icon,type,deleContent,isVisible} = useSelector( state => state.message)
  
  // setIsType(type)
  if(isVisible){
    if(type === 'edit' || type === 'create'){
      Swal.fire({
        title: title,
        icon: icon,
      }).then(()=>{
          navigate('/admin/products')
          dispatch(clearMessage())
      })
    }else if(type === 'delete'){
      console.log('delete',title,icon,type,deleContent)
      Swal.fire({
        title: `確定要刪除${deleContent[1]}嗎？`,
        icon: icon,
        showCancelButton: true,
        // confirmButtonColor: "#3085d6",
        // cancelButtonColor: "#d33",
        // confirmButtonText: "確認刪除",
        // cancelButtonText:"取消"
      }).then((result) => {
        if (result.isConfirmed) {
          deleteProduct(deleContent[0])
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
   
  }

  const deleteProduct = async (id) => await axios.delete(`${import.meta.env.VITE_APP_API_URL}/deleteProduct?id=${id}`)

}

export default Notification


