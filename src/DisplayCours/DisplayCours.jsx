import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Calendar,
  List,
  message,
  Modal,
  Rate,
  Space,
} from "antd";
import axios from "axios";
import VirtualList from "rc-virtual-list";
import PropTypes from "prop-types";

DisplayCours.propTypes = {
  idAdh: PropTypes.number,
};

export default function DisplayCours({ idAdh }) {
  const [courseData, setCourseData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [modalData, setModalData] = useState([]);

  const fetchCourses = async () => {
    const response = await axios.get(
      "http://127.0.0.1/badminton/src/PHP/cours.php",
    );
    const transformedData = response.data.reduce((acc, course) => {
      const date = new Date(course.datetime).toDateString();
      const heureCours = new Date(course.datetime).toLocaleTimeString();
      acc[date] = acc[date] || [];
      acc[date].push({
        ...course,
        type: "success",
        heure: heureCours,
      });
      return acc;
    }, {});
    setCourseData(transformedData);
    return transformedData;
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCourse = async (idCours, idAdherent, url, errorMessage) => {
    try {
      const response = await axios.post(url, { idCours, idAdh: idAdherent });
      if (response.data.status === "success") {
        message.success(response.data.message);
        const updatedCourses = await fetchCourses();
        if (selectedDate) {
          setModalData(updatedCourses[selectedDate] || []);
        }
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error(errorMessage, error);
      message.error(errorMessage);
    }
  };

  const reserveCourse = (idCours, idAdherent) =>
    handleCourse(
      idCours,
      idAdherent,
      "http://127.0.0.1/badminton/src/PHP/reserver-cours.php",
      "Une erreur est survenue durant la réservation du cours",
    );

  const cancelCourse = (idCours, idAdherent) =>
    handleCourse(
      idCours,
      idAdherent,
      `http://127.0.0.1/badminton/src/PHP/cancel-cours.php`,
      "Une erreur est survenue durant la désinscription du cours",
    );

  const onDateSelect = (value) => {
    const date = value.format("ddd MMM DD YYYY");
    setSelectedDate(date);
    const newData = courseData[date] || [];
    if (newData?.length > 0) {
      setModalData(newData);
      setIsModalOpened(true);
    }
  };

  const handleModal = () => setIsModalOpened(false);

  return (
    <div style={{ padding: "20px" }}>
      <Calendar
        dateCellRender={(value) => {
          const date = value.format("ddd MMM DD YYYY");
          const dataList = courseData[date] || [];
          console.log("dataList", dataList);
          return (
            <ul className="events">
              {dataList?.map((item) => (
                <Badge key={item.id} status={item.type} text={item.nomCours} />
              ))}
            </ul>
          );
        }}
        onSelect={onDateSelect}
      />
      <Modal
        title="Cours du jour"
        visible={isModalOpened}
        onOk={handleModal}
        onCancel={handleModal}
      >
        <List>
          <VirtualList
            data={modalData}
            height={400}
            itemHeight={47}
            itemKey="email"
          >
            {(item) => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  title={`${item.nomCours} : ${item.heure}`}
                  description={
                    <>
                      {item.averageRating && (
                        <>
                          Note moyenne :<br />
                          <Rate disabled value={item.averageRating} />
                          <br />
                        </>
                      )}
                      Professeur:
                      <br /> {item.prenomProfesseur} {item.nomProfesseur}
                      <br />
                      Inscrits: <br />
                      {item.registeredMembers
                        ? item.registeredMembers.join(", ")
                        : ""}
                    </>
                  }
                  style={{ whiteSpace: "pre-line" }}
                />
                <Space>
                  <Button
                    type="primary"
                    onClick={() => reserveCourse(item.idCours, idAdh)}
                  >
                    {"Je réserve"}
                  </Button>
                  <Button onClick={() => cancelCourse(item.idCours, idAdh)}>
                    {"Je me désinscris"}
                  </Button>
                </Space>
              </List.Item>
            )}
          </VirtualList>
        </List>
      </Modal>
    </div>
  );
}
