import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Input, Checkbox, Button, Form, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Login.css'

export default function Login() {
  const ug = useNavigate()
  const onFinish = (values: any) => {
    axios.get(`http://localhost:8000/users?username=${values.username}&password=${values.password}&roleType=true&_expand=role`)
    .then(res=>{console.log(res.data);
      if(res.data.length === 0){
        message.error("密码或用户名不匹配")
      }else{
        localStorage.setItem("token",JSON.stringify(res.data[0]))
        ug("/")
      }
    })
  };
  return (
    <div style={{ background: "rgb(35,39,65", height: "100%" }}>
      <div className="formContainer">
        <div className="logintitle">新闻发布管理系统</div>
        <Form name="normal_login" className="login-form" onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
