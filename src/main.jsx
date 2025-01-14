import './stylesheets/all.scss';
// import './index.css';
import { RouterProvider } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import router from "./routes";
import { Provider } from 'react-redux';
import { store } from './store';




createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>
)