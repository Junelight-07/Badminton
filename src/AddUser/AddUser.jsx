import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, DatePicker, Form, Input, message, Select } from "antd";
import dayjs from "dayjs";
import { format } from "date-fns";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

export default function AddUser() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const niveaux = ["Débutant", "Intermédiaire", "Expert"];
  const dateFormat = "DD-MM-YYYY";
  const currentYear = new Date().getFullYear();
  const currentDate = format(new Date(), "dd-MM");
  const yearFiveAgo = currentYear - 5;
  const types = ["Étudiant", "Salarié", "Retraité"];
  const [userType, setUserType] = useState("");
  const typesUser = ["adhérent", "professeur"];

  const yearHundredAgo = currentYear - 100;

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

  const onFinish = (values) => {
    values.dateAdhesionAdh = format(new Date(), "yyyy-MM-dd");
    axios
      .post(`http://127.0.0.1/badminton/src/PHP/add-user.php`, {
        values,
      })
      .then((res) => {
        if (res.status === 200) {
          message.success(res.data.message);
          navigate("/gestion");
        } else {
          message.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        message.error("Error adding user");
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
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        layout="vertical"
        onFinish={onFinish}
        style={{
          width: "30vw",
          maxWidth: 600,
        }}
        scrollToFirstError
      >
        <Form.Item
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
                    "The new user that you entered could not be admin!",
                  ),
                );
              },
            }),
          ]}
        >
          <Input prefix={<UserOutlined />} type="text" placeholder="Username" />
        </Form.Item>
        <Form.Item
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
                  new Error("The new password that you entered do not match!"),
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
          label="Type"
          name="type"
          rules={[{ required: true, message: "Veuillez entrer un type" }]}
        >
          <Select
            options={typesUser?.map((type) => ({
              label: type,
              value: type,
            }))}
            style={{
              width: "10vw",
            }}
            onChange={(value) => setUserType(value)}
          />
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
          label="Nom"
          name="nomAdh"
          rules={[{ required: true, message: "Veuillez entrer un nom" }]}
        >
          <Input />
        </Form.Item>
        {userType !== "professeur" && (
          <>
            <Form.Item
              required
              label="Date de naissance"
              name="dateAdh"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer votre date de naissance",
                },
              ]}
            >
              <DatePicker
                placeholder="Choisir une date"
                format={"DD-MM-YYYY"}
                defaultValue={dayjs(
                  `${currentDate}-${yearFiveAgo}`,
                  dateFormat,
                )}
                minDate={dayjs(`01-01-${yearHundredAgo}`, dateFormat)}
                maxDate={dayjs(`31-12-${yearFiveAgo}`, dateFormat)}
              />
            </Form.Item>
            <Form.Item
              required
              label="Adresse"
              name="adresseAdh"
              rules={[
                { required: true, message: "Veuillez entrer une adresse" },
              ]}
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
              required
              label="Niveau"
              name="niveauAdh"
              rules={[{ required: true, message: "Veuillez entrer un niveau" }]}
            >
              <Select
                options={niveaux?.map((niveau) => ({
                  label: niveau,
                  value: niveau,
                }))}
                style={{
                  width: "10vw",
                }}
              />
            </Form.Item>
            <Form.Item
              required
              label="Type"
              name="typeAdh"
              rules={[{ required: true, message: "Veuillez entrer un type" }]}
            >
              <Select
                options={types?.map((type) => ({
                  label: type,
                  value: type,
                }))}
                style={{
                  width: "10vw",
                }}
              />
            </Form.Item>
          </>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {"Add user"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
