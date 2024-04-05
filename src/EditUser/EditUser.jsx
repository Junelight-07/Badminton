import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, DatePicker, Form, Input, message, Select } from "antd";
import dayjs from "dayjs";
import { format } from "date-fns";

export default function EditUser() {
  const [status, setStatus] = useState("loading");
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const id = new URLSearchParams(location.search).get("id");
  const niveaux = ["Débutant", "Intermédiaire", "Expert"];
  const types = ["Étudiant", "Salarié", "Retraité"];
  const dateFormat = "DD-MM-YYYY";
  const currentYear = new Date().getFullYear();
  const currentDate = format(new Date(), "dd-MM");
  const yearFiveAgo = currentYear - 5;
  const yearHundredAgo = currentYear - 100;

  useEffect(() => {
    axios
      .get(`http://127.0.0.1/badminton/src/PHP/get-user.php?id=${id}`)
      .then((res) => {
        if (res.status === 200) {
          setUserData(res.data.user);
          setStatus("success");
        } else {
          setStatus("error");
        }
      })
      .catch((err) => {
        console.log(err);
        setStatus("error");
      });
  }, [id]);

  const onFinish = (changedValues) => {
    axios
      .put(
        `http://127.0.0.1/badminton/src/PHP/edit-user.php?id=${id}`,
        changedValues,
      )
      .then((res) => {
        if (res.status === 200) {
          message.success("User has been updated successfully");
          navigate("/gestion");
        } else {
          message.error("Error updating user");
        }
      })
      .catch((err) => {
        console.log(err);
        message.error("Error updating user");
      });
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  } else if (status === "success") {
    return (
      <Form layout="vertical" onFinish={onFinish} initialValues={userData}>
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
            defaultValue={dayjs(`${currentDate}-${yearFiveAgo}`, dateFormat)}
            minDate={dayjs(`01-01-${yearHundredAgo}`, dateFormat)}
            maxDate={dayjs(`31-12-${yearFiveAgo}`, dateFormat)}
          />
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
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
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
          required
          label="Type"
          name="typeAdh"
          rules={[{ required: true, message: "Veuillez entrer un type" }]}
        >
          <Select
            options={types.map((type) => ({
              label: type,
              value: type,
            }))}
            style={{
              width: "10vw",
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    );
  } else {
    return <div>Error loading user data.</div>;
  }
}
