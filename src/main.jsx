import './stylesheets/all.scss';
// import './index.css';
import { RouterProvider } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import router from "./routes";
import axios from "axios";
import { Provider } from 'react-redux';
import { store } from './store';

// axios 預設會加入這串網址 import.meta.env.VITE_APP_API_URL
// axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>
)