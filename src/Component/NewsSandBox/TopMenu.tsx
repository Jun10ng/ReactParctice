import { Avatar, Dropdown, Layout } from "antd";
import "../NewsSandBox/NewsSandBox.css";
import type { MenuProps } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { observer } from "mobx-react";
import  {TodoStore} from "./Stores";
import { useNavigate } from "react-router-dom";

function TopMenu({cstore}:{cstore:TodoStore}) {
  const { Header } = Layout;
  const ua = useNavigate()

  const handleOnCollasped = () => {
    cstore.setCollasped(!cstore.collasped)
  };

  const handleLogout = () =>{
    localStorage.removeItem("token")
    ua("/login")
  }

  const {role:{roleName},username} = JSON.parse(localStorage.getItem("token")||'{}')

  const items:MenuProps['items'] = [
    { label: roleName, key: "item-1" }, // 菜单项务必填写 key
    { label: "退出", key: "item-2",danger: true,}
  ];
  
  const onClick: MenuProps['onClick'] = ({ key }) => {
    switch (key){
      case "item-2"://退出登陆
        return handleLogout()
    }
  };

  
  return (
    <Header className="site-layout-background" style={{ padding: 0 }}>
      {cstore.collasped? (
        <MenuUnfoldOutlined className="trigger" onClick={handleOnCollasped} />
      ) : (
        <MenuFoldOutlined className="trigger" onClick={handleOnCollasped} />
      )}
      <div style={{ float: "right", padding: "0 24px" }}>
        <span>欢迎 {username} 回来    </span>
        <Dropdown menu={{ items,onClick }}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  );
}


export default observer(TopMenu);