import { Outlet } from "react-router-dom";
import Notification from "./components/admin/Notification";

function App() {
  return (
    <div className="App">
      <Notification/>
      <div className="flex justify-center min-h-screen">
        {/* Routes 主要輸出內容的區塊 */}
        <Outlet/>
      </div>
    </div>
  );
}

export default App;