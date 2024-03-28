import React, { useRef, useState } from "react";
import { Button, Checkbox, Form, Input, message, Select, Space } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./CreateUser.module.scss";

const { Option } = Select;

export default function CreateUser() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [error, setError] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null);
  const captchaRef = useRef(null);
  const niveaux = ["Débutant", "Intermédiaire", "Expert"];
  const types = ["Étudiant", "Salarié", "Retraité"];
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };
  const onFinish = (values) => {
    axios
      .post("http://127.0.0.1/badminton/src/PHP/create-user.php", {
        values,
      })
      .then((res) => {
        if (res.data.status === "done") {
          message.success(res.data.message);
          navigate("/login");
        } else if (res.data.status === "error") {
          message.error(res.data.message);
        } else {
          setError("Invalid credentials");
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
      <div style={{ width: "30vw" }}>
        <h2 style={{ textAlign: "center" }}>{"Register Page"}</h2>
        <Form
          className={styles.form}
          {...formItemLayout}
          form={form}
          name="register"
          layout="vertical"
          onFinish={onFinish}
          style={{
            maxWidth: 600,
          }}
          scrollToFirstError
          initialValues={{ niveauAdh: niveaux[0] }}
        >
          <Form.Item
            className={styles.item}
            name="username"
            label="Username"
            rules={[
              {
                required: true,
                message: "Please input your username",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("username") !== "admin") {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The new password that you entered could not be admin!",
                    ),
                  );
                },
              }),
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              type="text"
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            className={styles.item}
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item
            className={styles.item}
            name="confirm"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The new password that you entered do not match!",
                    ),
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item
            required
            label="Nom"
            name="nomAdh"
            rules={[{ required: true, message: "Veuillez entrer un nom" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            required
            label="Prénom"
            name="prenomAdh"
            rules={[{ required: true, message: "Veuillez entrer un prénom" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            required
            label="Adresse"
            name="adresseAdh"
            rules={[{ required: true, message: "Veuillez entrer une adresse" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            required
            label="Ville"
            name="villeAdh"
            rules={[{ required: true, message: "Veuillez entrer une ville" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            required
            label="Code Postal"
            name="cpAdh"
            rules={[
              { required: true, message: "Veuillez entrer un code postal" },
              {
                pattern: /^[0-9]{5}$/,
                message: "Veuillez entrer un code postal valide",
              },
            ]}
          >
            <Input type="number" min={0} max={99999} maxLength={5} />
          </Form.Item>
          <Form.Item
            className={styles.item}
            required
            label="Niveau"
            name="niveauAdh"
            rules={[{ required: true, message: "Veuillez entrer un niveau" }]}
          >
            <Select
              options={niveaux.map((niveau) => ({
                label: niveau,
                value: niveau,
              }))}
              style={{
                width: "10vw",
              }}
            />
          </Form.Item>
          <Form.Item
            className={styles.item}
            required
            label="Type"
            name="typeAdh"
            rules={[{ required: true, message: "Veuillez entrer un type" }]}
          >
            <Select
              placeholder={"Please select a type"}
              options={types.map((type) => ({
                label: type,
                value: type,
              }))}
              style={{
                width: "10vw",
              }}
            />
          </Form.Item>
          {/*<Form.Item*/}
          {/*  name="gender"*/}
          {/*  label="Gender"*/}
          {/*  rules={[*/}
          {/*    {*/}
          {/*      required: true,*/}
          {/*      message: "Please select gender!",*/}
          {/*    },*/}
          {/*  ]}*/}
          {/*>*/}
          {/*  <Select placeholder="select your gender">*/}
          {/*    <Option value="male">{"Male"}</Option>*/}
          {/*    <Option value="female">{"Female"}</Option>*/}
          {/*    <Option value="other">{"Other"}</Option>*/}
          {/*  </Select>*/}
          {/*</Form.Item>*/}
          {/*<Form.Item*/}
          {/*  label="Captcha"*/}
          {/*  extra="We must make sure that your are a human."*/}
          {/*  rules={[*/}
          {/*    {*/}
          {/*      validator: (_, value) =>*/}
          {/*        captchaValue*/}
          {/*          ? Promise.resolve()*/}
          {/*          : Promise.reject(new Error("Please verify the captcha")),*/}
          {/*    },*/}
          {/*  ]}*/}
          {/*>*/}
          {/*  <ReCAPTCHA*/}
          {/*    ref={captchaRef}*/}
          {/*    sitekey={"6LfqC6cpAAAAAHGXdS2_po4zE4LECsgBXKUmA73j"}*/}
          {/*    onChange={(value) => setCaptchaValue(value)}*/}
          {/*  />*/}
          {/*</Form.Item>*/}
          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error("Should accept agreement")),
              },
            ]}
            {...tailFormItemLayout}
          >
            <Checkbox>
              {"I have read the "} <a href="">{"agreement"}</a>
            </Checkbox>
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Space>
              <Button type="primary" htmlType="submit">
                {"Register"}
              </Button>
              Or <a href="/login">{"login now!"}</a>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}