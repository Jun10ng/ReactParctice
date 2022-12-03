import { Breadcrumb, Layout } from "antd";
import React, { useEffect } from "react";
import { RouteObject, useNavigate, useRoutes } from "react-router-dom";
import NoPermission from "../NoPermission";
import Category from "./Component/NewsManage/Category";
import Draft from "./Component/NewsManage/Draft";
import Home from "./Component/Home";
import RightList from "./Component/RightList";
import RoleList from "./Component/RoleList";
import UserList from "./Component/UserList";
import SideMenu from "./SideMenu";
import { TokenValidte } from "./TokenValidte";
import TopMenu from "./TopMenu";
import "./NewsSandBox.css";
import { Provider } from "mobx-react";
import store from "./Stores";
import RouteAuth from "./RouteAuth";
import NProgress from "nprogress";
import "nprogress/nprogress.css"
import NewsAdd from "./Component/NewsManage/NewsAdd";

const sandBoxRoutes = [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/user-manage/list",
      element: <UserList />,
      meta:{
        auth:true,
        unRoleIds:[999]
      }
    },
    {
      path: "/right-manage/role/list",
      element: <RoleList />,
    },
    {
      path: "/right-manage/right/list",
      element: <RightList />,
    },
    {
      path: "/news-manage/draft",
      element: <Draft />,
    },
    {
      path: "/news-manage/category",
      element: <Category />,
    },
    {
      path: "/news-manage/add",
      element: <NewsAdd />,
    },
    {
      path: "*",
      element: <NoPermission />,
    },
  ]
const SandBoxRoutes = () => {
  return useRoutes(sandBoxRoutes);
};

export default function NewsSandBox() {
  const ug = useNavigate();
  const Content = Layout;
  NProgress.start()
  useEffect(() => {
    NProgress.done()
    TokenValidte() ? "" : ug("/login");
  });
  // console.log(store);
  
  return (
    // <Provider {...stores}>
    <Layout>
      <SideMenu cstore={store} />
      {/* <Layout style={{height:'100%'}}> */}
      <Layout className="site-layout">
        {/* <TopMenu store={store}/> */}
        <TopMenu cstore={store} />
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            height: "100%",
          }}
        >
          <RouteAuth routes={sandBoxRoutes}>
            <SandBoxRoutes />
          </RouteAuth>
        </Content>
      </Layout>
    </Layout>
    // </Provider>
  );
}
