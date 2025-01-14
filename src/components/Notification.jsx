import axios from "axios"
import Swal from "sweetalert2"
import { useDispatch, useSelector } from "react-redux"
import { clearMessage } from "../slice/messageSlice"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

import Loading from "./Loading"

const Notification = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loadingState, setLoadingState] = useState(false)
  const [swalTriggered, setSwalTriggered] = useState(false) // 防止重複觸發 Swal
  const { deleName, title, icon, type, deleContent, isVisible } = useSelector(
    (state) => state.message
  )

  useEffect(() => {
    if (!isVisible || swalTriggered) return // 如果已經觸發過 跳過
    setSwalTriggered(true) // 標記 Swal 已觸發

    if (type === "edit" || type === "create") {
      Swal.fire({
        title: title,
        icon: icon,
      }).then(() => {
        navigate("/admin/products")
        dispatch(clearMessage())
        setSwalTriggered(false) // 重置狀態
      })
    } else if (type === "orderdata") {
      Swal.fire({
        title: title,
        icon: icon,
      }).then(() => {
        navigate("/admin/orders")
        dispatch(clearMessage())
        setSwalTriggered(false) // 重置狀態
      })
    } else if (type === "delete") {
      Swal.fire({
        title: `確定要刪除${deleContent[1]}嗎？`,
        icon: icon,
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          setLoadingState(true)
          deleteProduct(deleContent[0])
            .then(() => {
              Swal.fire({
                title: "資料已刪除!",
                icon: "success",
                confirmButtonText: "確認",
              }).then(() => {
                dispatch(clearMessage())
                window.location.reload()
                navigate(`/admin/${deleName}`)
                setLoadingState(false)
                setSwalTriggered(false) // 重置狀態
              })
            })
            .catch((error) => {
              console.log("error", error.response.data.message)
              Swal.fire({
                title: error.response.data.message,
                icon: "error",
              })
              setLoadingState(false)
              setSwalTriggered(false) // 重置狀態
            })
        } else {
          dispatch(clearMessage())
          setLoadingState(false)
          setSwalTriggered(false) // 重置狀態
        }
      })
    }
  }, [isVisible, type, title, icon, deleContent, deleName, dispatch, navigate, swalTriggered])

  const deleteProduct = async (id) => {
    let endpoint = ""
    if (deleName === "orders") {
      endpoint = `deleteOrder?id=${id}`
    } else {
      endpoint = `deleteProduct?id=${id}`
    }
    await axios.delete(`${import.meta.env.VITE_APP_API_URL}${endpoint}`)
  }

  // loading
  if (loadingState) {
    return <Loading loadingText="刪除中...請稍候" />
  }

  return null // 如果沒有 loading 或 swal 狀態 null
}

export default Notification
