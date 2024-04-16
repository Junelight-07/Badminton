import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, message, Select } from "antd";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { format } from "date-fns";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

AddCours.propTypes = {
  idProf: PropTypes.number,
  isAdmin: PropTypes.bool.isRequired,
};

export default function AddCours({ isAdmin, idProf }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const cours = [
    "Badminton Débutant",
    "Badminton Intermédiaire",
    "Badminton Expert",
  ];
  const type = new URLSearchParams(location.search).get("type");
  const dateFormat = "DD-MM-YYYY";
  const currentDate = format(new Date(), "dd-MM-yyyy");
  const [professeurs, setProfesseurs] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1/badminton/src/PHP/professeurs.php",
        );
        setProfesseurs(response.data.professeurs);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données des profs :",
          error,
        );
      }
    };
    fetchCourses();
  }, []);

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
    !isAdmin && (values.idProfesseur = idProf);

    axios
      .post("http://127.0.0.1/badminton/src/PHP/add-cours.php", {
        values,
      })
      .then((res) => {
        if (res.data.status === "done") {
          message.success(res.data.message);
          navigate("/cours");
        } else if (res.data.status === "error") {
          message.error(res.data.message);
        } else {
          message.error(res.data.message);
        }
      })
      .catch((err) => {
        message.error(
          "An error occurred while trying to create a new cours",
          err,
        );
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
        <h2 style={{ textAlign: "center" }}>{"Add Cours Page"}</h2>
        <Form
          initialValues={{ typeAdh: type }}
          {...formItemLayout}
          form={form}
          name="register"
          layout="vertical"
          onFinish={onFinish}
          style={{
            maxWidth: 600,
          }}
          scrollToFirstError
        >
          <Form.Item
            required
            label="Nom du cours"
            name="nomCours"
            rules={[
              { required: true, message: "Veuillez choisir le nom du cours" },
            ]}
          >
            <Select
              options={cours?.map((cour) => ({
                label: cour,
                value: cour,
              }))}
              style={{
                width: "10vw",
              }}
            />
          </Form.Item>
          <Form.Item
            required
            label="Date du cours"
            name="datetime"
            rules={[
              {
                required: true,
                message: "Veuillez entrer la date du cours",
              },
            ]}
          >
            <DatePicker
              placeholder="Choisir une date"
              format={"DD-MM-YYYY"}
              defaultValue={dayjs(`${currentDate}`, dateFormat)}
              minDate={dayjs(`${currentDate}`, dateFormat)}
              showTime
            />
          </Form.Item>

          {isAdmin && (
            <Form.Item
              required
              label="Professeur"
              name="idProfesseur"
              rules={[
                {
                  required: true,
                  message: "Veuillez choisir le professeur",
                },
              ]}
            >
              <Select
                placeholder="Choisissez un professeur"
                options={professeurs?.map((professeur) => ({
                  label: `${professeur.nomProfesseur} ${professeur.prenomProfesseur}`,
                  value: professeur.idProfesseur,
                }))}
              />
            </Form.Item>
          )}

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              {"Créer le cours de super badmintonnien"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
