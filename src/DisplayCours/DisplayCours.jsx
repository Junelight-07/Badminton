import React, { useEffect, useState } from "react";
import { Badge, Calendar, List, Modal } from "antd";
import axios from "axios";
import VirtualList from "rc-virtual-list";

export default function DisplayCours() {
  const [courseData, setCourseData] = useState({});
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [modalData, setModalData] = useState([]);
  const ContainerHeight = 400;

  const transformCourses = (courses) => {
    const transformedData = {};
    courses.forEach((course) => {
      const date = new Date(course.datetime).toDateString();
      if (!transformedData[date]) {
        transformedData[date] = [];
      }
      transformedData[date].push({
        type: "success",
        cours: course.nomCours,
        id: course.idCours,
        prenomProf: course.prenomProfesseur,
        nomProf: course.nomProfesseur,
      });
    });
    return transformedData;
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1/badminton/src/PHP/cours.php",
        );
        const transformedCourses = transformCourses(response.data);
        setCourseData(transformedCourses);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données des cours :",
          error,
        );
      }
    };
    fetchCourses();
  }, []);

  const getListData = (value) => {
    const date = value.format("ddd MMM DD YYYY");
    return courseData[date] || [];
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <Badge key={item.id} status={item.type} text={item.cours} />
        ))}
      </ul>
    );
  };

  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return <div>EMPTY</div>;
  };

  const onDateSelect = (value) => {
    const date = value.format("ddd MMM DD YYYY");
    const newData = courseData[date] || [];
    if (newData?.length > 0) {
      setModalData(newData);
      setIsModalOpened(true);
    }
  };

  const handleOk = () => {
    setIsModalOpened(false);
  };

  const handleCancel = () => {
    setIsModalOpened(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Calendar cellRender={cellRender} onSelect={onDateSelect} />
      <Modal
        title="Cours du jour"
        open={isModalOpened}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <List>
          <VirtualList
            data={modalData}
            height={ContainerHeight}
            itemHeight={47}
            itemKey="email"
          >
            {(item) => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  title={item.cours}
                  description={`${item.prenomProf} ${item.nomProf}`}
                />
              </List.Item>
            )}
          </VirtualList>
        </List>
      </Modal>
    </div>
  );
}
