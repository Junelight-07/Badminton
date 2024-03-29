import React, { useEffect, useState } from "react";
import { Badge, Calendar } from "antd";
import axios from "axios";

export default function DisplayCours() {
  const [courseData, setCourseData] = useState({});
  const transformCourses = (courses) => {
    const transformedData = {};
    courses.forEach((course) => {
      const date = new Date(course.datetime).toDateString();
      if (!transformedData[date]) {
        transformedData[date] = [];
      }
      transformedData[date].push({
        type: "success",
        content: course.nomCours,
        id: course.idCours,
        professeur: course.idProfesseur,
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
        console.log("courseData", response.data);
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
    console.log("listData", listData);
    return (
      <ul className="events">
        {listData.map((item) => (
          <Badge key={item.id} status={item.type} text={item.content} />
        ))}
      </ul>
    );
  };

  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return <div>EMPTY</div>;
  };

  return (
    <div style={{ padding: "20px" }}>
      <Calendar cellRender={cellRender} />
    </div>
  );
}
