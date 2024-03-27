import React, { useState } from "react";
import axios from "axios";
import { Alert, Button, Checkbox, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const onFinish = (values) => {
    axios
      .post("http://127.0.0.1/badminton/src/PHP/login.php", {
        username: values.username,
        password: values.password,
      })
      .then((res) => {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          navigate("/");
        } else {
          setError("Invalid credentials");
        }
      })
      .catch((err) => {
        console.log(err);
        setError("An error occurred while trying to log in");
      });
  };

  return (
    <>
      <h2>Login Page</h2>
      <Form
        name="normal_login"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          required
          name="username"
          rules={[{ required: true, message: "Veuillez entrer un username" }]}
        >
          <Input prefix={<UserOutlined />} type="text" placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          required
          rules={[
            { required: true, message: "Veuillez entrer un mot de passe" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        {error && <Alert message={error} type="error" />}
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a href="/">Forgot password</a>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Log in
          </Button>
          Or <a href="/">register now!</a>
        </Form.Item>
      </Form>
    </>
  );
}
