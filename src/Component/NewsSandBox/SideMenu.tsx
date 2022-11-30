import { Breadcrumb, Layout, Menu, MenuProps } from "antd";
import { MenuInfo } from "rc-menu/lib/interface";
import { UserOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import "../NewsSandBox/NewsSandBox.css";
import { useHref, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ItemType } from "rc-menu/lib/interface";
import { inject, observer } from "mobx-react";
import { TodoStore } from "./Stores";
import { Right } from "./Component/RightList";

// 从接口内取到的菜单配置
interface MenuItem {
  id: number;
  title: string;
  key: string;
  pagepermisson: number;
  grade: number;
  children: any[];
}

const iconMap = new Map([
  ["/home", <UserOutlined />],
  ["/user-manage", <UserOutlined />],
  ["/right-manage", <UserOutlined />],
  ["/news-manage", <UserOutlined />],
  ["/audit-manage", <UserOutlined />],
  ["/publish-manage", <UserOutlined />],
  // '/audit-manage':<UserOutlined/>,
]);

// 转换 接口返回菜单数据 成 组件需要的格式
const ConvMenuItem2ItemType = (arr: Array<MenuItem>,rights:Array<string>): Array<any> => {
  let itemTypeList: Array<any> = new Array<any>();
  arr.forEach((item) => {
    if (item.pagepermisson === 1 && rights.includes(item.key)) {
      itemTypeList.push({
        key: item.key,
        icon: iconMap.get(item.key),
        label: item.title,
        /// children 不存在或者children长度为0
        children:
          !item.children || item.children.length === 0
            ? undefined
            : ConvMenuItem2ItemType(item.children,rights),
      });
    }
  });
  // console.log(itemTypeList)
  return itemTypeList;
};

function SideMenu({ cstore }: { cstore: TodoStore }) {
  const { Sider } = Layout;
  const [collapsed, setCollapsed] = useState(false);
  const [itemTypeList, setItemTypeList] = useState(Array<ItemType>);
  const ug = useNavigate();
  const location = useLocation();
  let pathList = location.pathname.split("/");
  let defaultKey1 = "/" + pathList[1];
  let defaultKey2 = pathList[2] ? defaultKey1 + "/" + pathList[2] : "";

  const {role:{rights}} = JSON.parse(localStorage.getItem("token")||'{}')
  const handleOnMenuClick = (item: MenuInfo) => {
    console.log("click side menu and skip to", item.key);
    ug(item.key);
  };

  useEffect(() => {
    let menuItems: Array<MenuItem>;
    axios.get("http://127.0.0.1:8000/rights?_embed=children").then((res) => {
      menuItems = res.data as Array<MenuItem>;
      setItemTypeList(ConvMenuItem2ItemType(menuItems,rights));
      // console.log("=====")
    });
  }, []);
  // console.log(props)
  return (
    <Sider trigger={null} collapsible collapsed={cstore.collasped}>
      <div className="logo">新闻发布管理系统</div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[defaultKey1, defaultKey2]}
        defaultOpenKeys={[defaultKey1]}
        onClick={handleOnMenuClick}
        items={itemTypeList}
      />
    </Sider>
  );
}

export default observer(SideMenu);
