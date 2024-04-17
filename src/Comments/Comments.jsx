import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Card, Form, Input, message, Rate } from "antd";
import {
  FaRegFaceFrown,
  FaRegFaceFrownOpen,
  FaRegFaceMeh,
  FaRegFaceSmile,
  FaRegFaceSmileBeam,
} from "react-icons/fa6";
import { format } from "date-fns";
import axios from "axios";

Comments.propTypes = {
  idAdh: PropTypes.number.isRequired,
};

export default function Comments({ idAdh }) {
  const [form] = Form.useForm();
  const [courses, setCourses] = useState([]);
  const customIcons = {
    1: <FaRegFaceFrown />,
    2: <FaRegFaceFrownOpen />,
    3: <FaRegFaceMeh />,
    4: <FaRegFaceSmile />,
    5: <FaRegFaceSmileBeam />,
  };

  useEffect(() => {
    axios
      .post("http://127.0.0.1/badminton/src/PHP/cours-to-be-commented.php", {
        idAdh: idAdh,
      })
      .then((res) => {
        if (res.data.status === "done") {
          setCourses(res.data.courses);
        } else if (res.data.status === "error") {
          message.error(res.data.message);
        } else {
          message.error("Invalid data");
        }
      })
      .catch((error) => {
        message.error(
          "An error occurred while trying to fetch the courses",
          error,
        );
      });
  }, []);

  const onFinish = (values) => {
    values.dateCommentaire = format(new Date(), "yyyy-MM-dd");
    values.idAdh = idAdh;
    values.idCours = courses[0].idCours;
    axios
      .post("http://127.0.0.1/badminton/src/PHP/comment.php", {
        values,
      })
      .then((res) => {
        if (res.data.status === "done") {
          form.resetFields();
          setCourses(courses.slice(1));
          message.success(res.data.message);
        } else if (res.data.status === "error") {
          message.error(res.data.message);
        } else {
          message.error("Invalid data");
        }
      })
      .catch((error) => {
        message.error(
          "An error occurred while trying to create the user",
          error,
        );
      });
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "600px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <h1>{"Mes cours à noter"}</h1>
      {courses?.length > 0 ? (
        <Card
          title={courses[0].nomCours}
          style={{ width: "100%" }}
          extra={courses[0].datetime}
        >
          <Form form={form} onFinish={onFinish} initialValues={{ rating: 3 }}>
            <Form.Item
              name="comment"
              rules={[
                { required: true, message: "Please input your comment!" },
              ]}
            >
              <Input.TextArea placeholder="Votre commentaire" />
            </Form.Item>
            <Form.Item
              name="rating"
              rules={[{ required: true, message: "Please rate the course!" }]}
            >
              <Rate character={({ index = 0 }) => customIcons[index + 1]} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {"Ajouter"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ) : (
        <p>
          {"Vous n'avez aucun cours à commenter"}
          <br />
          <a href={"/cours"} style={{ textDecoration: "none" }}>
            {"Réservez votre cours !"}
          </a>
        </p>
      )}
    </div>
  );
}
