import { Outlet } from "react-router-dom";
import Notification from "./components/Notification";

function App() {
  return (
    <div className="App">
      <Notification/>
      <div className="flex justify-center min-h-screen bg-bottom-bg bg-no-repeat">
        {/* Routes 主要輸出內容的區塊 */}
        <Outlet/>
      </div>
    </div>
  );
}

export default App;