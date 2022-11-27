import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Input, Checkbox, Button, Form } from "antd";
import './Login.css'

export default function Login() {
  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
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
