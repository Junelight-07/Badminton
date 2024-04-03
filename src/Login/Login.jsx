import React, { useState } from "react";
import axios from "axios";
import { Alert, Button, Form, Input, Space } from "antd";
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
        if (res.status === 200) {
          localStorage.setItem("token", res.data.token);
          navigate("/donuts-user");
          window.location.reload();
        } else {
          setError(res.data.message);
        }
      })
      .catch((err) => {
        setError("An error occurred while trying to log in");
        if (err.request.response) setError("Invalid credentials");
      });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
      }}
    >
      <h2>{"Login Page"}</h2>
      <Form
        name="normal_login"
        initialValues={{
          remember: true,
        }}
        style={{
          textAlign: "center",
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
          extra={<a href="/">{"Forgot password"}</a>}
        >
          <Input.Password
            prefix={<LockOutlined />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        {error && <Alert message={error} type="error" />}

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              {"Log in"}
            </Button>
            {"Or"} <a href="/create-user">{"register now!"}</a>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}
