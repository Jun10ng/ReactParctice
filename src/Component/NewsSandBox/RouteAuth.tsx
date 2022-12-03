import { message } from 'antd'
import Meta from 'antd/es/card/Meta'
import axios from 'axios'
import React, { Fragment, ReactNode, useEffect, useLayoutEffect, useState } from 'react'
import { json, matchRoutes,  RouteObject,  useLocation, useNavigate } from 'react-router-dom'
import { Role } from './Component/RoleList'

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
  const userInfo = localStorage.getItem("token")
  const ug = useNavigate()
  const location = useLocation()
  const matches = matchRoutes(routes,location)
  
  useLayoutEffect(() => {
    if (location.pathname === '/login'){
      return 
    }
    if (!matches||matches.length==0){
      console.log("there is no matched route")
      ug("/")
    }
    const isNeedLogin = matches?.some(item=>{
      let rt = item.route
      if (!rt.meta){return false}
      return rt.meta?.auth
    })
    if (isNeedLogin && userInfo==null){
      console.log("you need to login, see you later!")
      ug("/login")
    }


    let haveRight:boolean = false
    const {roleId} = JSON.parse(userInfo||'{roleId:-1}')
    async function checkRight(){
      await async function(){// 这里的await async写法真难写
        const res = await axios.get(`http://localhost:8000/roles?roleType=${roleId}`)
        let roleType: Array<Role> = res.data
        let curRole = roleType[0]
        haveRight = curRole.rights.includes(location.pathname) || location.pathname === '/' 
      }()
      if (!haveRight){
        // ug('/')
        message.info("you have no right to visit page: "+location.pathname)
      } 
    }
    checkRight()
  },[] )

  return <Fragment>{ children}</Fragment>
}
export default RouteAuth;
