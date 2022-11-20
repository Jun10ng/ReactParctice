import { Breadcrumb, Layout } from "antd";
import React, { useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";
import NoPermission from "../NoPermission";
import Category from "./Component/Category";
import Draft from "./Component/Draft";
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

const SandBoxRoutes = () => {
  return useRoutes([
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
      path: "/new-manage/draft",
      element: <Draft />,
    },
    {
      path: "/new-manage/category",
      element: <Category />,
    },
    {
      path: "*",
      element: <NoPermission />,
    },
  ]);
};

export default function NewsSandBox() {
  const ug = useNavigate();
  const Content = Layout;
  useEffect(() => {
    TokenValidte() ? "" : ug("/login");
  });
  console.log(store);
  
  return (
    // <Provider {...stores}>
      <Layout>
        <SideMenu cstore={store}/>
        {/* <Layout style={{height:'100%'}}> */}
        <Layout className="site-layout">
          {/* <TopMenu store={store}/> */}
          <TopMenu cstore={store}/>
          <Content
            className="site-layout-background"
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              height: "100%",
            }}
          >
            <SandBoxRoutes />
          </Content>
        </Layout>
      </Layout>
    // </Provider>
  );
}
