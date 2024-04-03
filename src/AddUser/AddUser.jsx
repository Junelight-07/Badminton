import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, DatePicker, Form, Input, message, Select } from "antd";
import dayjs from "dayjs";
import { format } from "date-fns";

export default function AddUser() {
  const navigate = useNavigate();
  const niveaux = ["Débutant", "Intermédiaire", "Expert"];
  const dateFormat = "DD-MM-YYYY";
  const currentYear = new Date().getFullYear();
  const currentDate = format(new Date(), "dd-MM");
  const yearFiveAgo = currentYear - 5;
  const types = ["Étudiant", "Salarié", "Retraité"];
  const yearHundredAgo = currentYear - 100;

  const onFinish = (values) => {
    values.dateAdhesionAdh = format(new Date(), "yyyy-MM-dd");
    axios
      .put(`http://127.0.0.1/badminton/src/PHP/add-user.php`, values)
      .then((res) => {
        if (res.status === 200) {
          message.success("User has been added successfully");
          navigate("/gestion");
        } else {
          message.error("Error adding user");
        }
      })
      .catch((err) => {
        console.log(err);
        message.error("Error adding user");
      });
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
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
        rules={[{ required: true, message: "Veuillez entrer un code postal" }]}
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
          {"Add user"}
        </Button>
      </Form.Item>
    </Form>
  );
}
