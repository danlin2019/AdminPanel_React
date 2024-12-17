import { Outlet } from "react-router-dom";

function Modals() {
  return (
    <div className="container">
      { <Outlet/> }
    </div>
  )
}

export default Modals;