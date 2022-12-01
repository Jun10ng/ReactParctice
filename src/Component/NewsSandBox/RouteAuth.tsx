import Meta from 'antd/es/card/Meta'
import React, { Fragment, ReactNode, useEffect } from 'react'
import { matchRoutes,  RouteObject,  useLocation, useNavigate } from 'react-router-dom'

interface RouteAuthProps{
  children:ReactNode
  routes:RouteProps[]
}
export type RouteProps = RouteObject &{
  meta?: {
    auth?: boolean
    roles?: number[]
    unRoles?: number[] 
  }
  children?: RouteProps[]
}

const RouteAuth:React.FC<RouteAuthProps>= ({children,routes})=>{
  // console.log("route auth")
  const userInfo = localStorage.getItem("token")
  const ug = useNavigate()
  // console.log(userInfo)
  const location = useLocation()
  const matches = matchRoutes(routes,location)
  // console.log("matches is",matches)
  if (!matches||matches.length==0){
    console.log("there is no matched route")
    ug("/")
  }
  // path exist
  // check weather the path need login
  const isNeedLogin = matches?.some(item=>{
    let rt = item.route
    if (!rt.meta){return false}
    return rt.meta?.auth
  })

  useEffect(() => {
    if (isNeedLogin && userInfo==null){
      console.log("you need to login, see you later!")
      ug("/")
    }
  
  },[] )
  
  return <Fragment>{children}</Fragment>
}
export default RouteAuth;