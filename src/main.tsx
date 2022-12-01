import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, RouteObject, useRoutes } from 'react-router-dom'
import Login from './Component/Login/Login'
import NewsSandBox from './Component/NewsSandBox/NewsSandBox'
import Other from './Component/Other'
import 'antd/dist/reset.css';
import { Provider } from 'mobx-react'
import stores from './Component/NewsSandBox/Stores'
import RouteAuth from './Component/NewsSandBox/RouteAuth'

const mainRoute:RouteObject[] =[
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
  ] 
const RootRouter = () => { 
  return useRoutes(mainRoute);
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
    <RouteAuth routes={mainRoute}>
        <RootRouter />
    </RouteAuth>
    </BrowserRouter>
  </React.StrictMode>
)




