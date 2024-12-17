// import {Routes,Route} from 'react-router-dom'
import { Outlet } from "react-router-dom";


function App() {
  return (
    <div className="App">
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        {/* Routes 主要輸出內容的區塊 */}
        <Outlet/>
      </div>
    </div>
  );
}

export default App;