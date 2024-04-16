import React, { useEffect, useState } from "react";
import axios from "axios";
import DonutChart from "react-donut-chart";

export default function DonutsUser() {
  const [datas, setDatas] = useState({});

  useEffect(() => {
    axios
      .get("http://127.0.0.1/badminton/src/PHP/get-datas.php")
      .then((response) => {
        setDatas(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données:", error);
      });
  }, []);

  function renderTypeDonut(d) {
    let counts = {};
    d?.map((item) => {
      if (!counts[item.typeAdh]) {
        counts[item.typeAdh] = 0;
      }
      counts[item.typeAdh]++;
    });

    const chartData = Object.entries(counts)?.map(([key, value]) => ({
      value,
      label: `${key}`,
    }));

    return <DonutChart data={chartData} />;
  }

  function renderNiveauDonut(d) {
    let counts = {};
    d?.map((item) => {
      if (!counts[item.niveauAdh]) {
        counts[item.niveauAdh] = 0;
      }
      counts[item.niveauAdh]++;
    });

    const chartData = Object.entries(counts)?.map(([key, value]) => ({
      value,
      label: `${key}`,
    }));

    return (
      <DonutChart
        data={chartData}
        colors={[
          "#00bcd4",
          "#009688",
          "#4caf50",
          "#8bc34a",
          "#cddc39",
          "#ffeb3b",
          "#ffc107",
          "#ff9800",
          "#ff5722",
          "#795548",
          "#607d8b",
        ]}
      />
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <div>
        <h1>{"Type des adhérents"}</h1>
        {datas.length && renderTypeDonut(datas)}
      </div>
      <div>
        <h1>{"Niveau des adhérents"}</h1>
        {datas.length && renderNiveauDonut(datas)}
      </div>
    </div>
  );
}
