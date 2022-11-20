import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, useRoutes } from 'react-router-dom'
import Login from './Component/Login/Login'
import NewsSandBox from './Component/NewsSandBox/NewsSandBox'
import Other from './Component/Other'
import 'antd/dist/reset.css';
import { Provider } from 'mobx-react'
import stores from './Component/NewsSandBox/Stores'


const RootRouter = () => { 
  return useRoutes([
    {
      path:"/*",
      element:<NewsSandBox/>
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "other/*",
      element: <Other />,
    }
    ]);
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
        <RootRouter />
    </BrowserRouter>
  </React.StrictMode>
)




