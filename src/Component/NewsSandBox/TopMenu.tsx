import { Avatar, Dropdown, Layout } from "antd";
import React, { useState } from "react";
import "../NewsSandBox/NewsSandBox.css";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { inject, observer } from "mobx-react";
import  {TodoStore} from "./Stores";
import { observable } from "mobx";

function TopMenu({cstore}:{cstore:TodoStore}) {
  const { Header } = Layout;
  // const [collapsed, setCollapsed] = useState(false);
  // let collapsed = todoStore.collapsed.
  console.log(cstore);
  

  const handleOnCollasped = () => {
    cstore.setCollasped(!cstore.collasped)
    console.log(cstore.collasped)
  };

  const items = [
    { label: "超级管理员", key: "item-1" }, // 菜单项务必填写 key
    { label: "退出", key: "item-2" },
  ];
  return (
    <Header className="site-layout-background" style={{ padding: 0 }}>
      {cstore.collasped? (
        <MenuUnfoldOutlined className="trigger" onClick={handleOnCollasped} />
      ) : (
        <MenuFoldOutlined className="trigger" onClick={handleOnCollasped} />
      )}
      <div style={{ float: "right", padding: "0 24px" }}>
        <span>欢迎 Admin 回来    </span>
        <Dropdown menu={{ items }}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  );
}


export default observer(TopMenu);