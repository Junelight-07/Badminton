import React, { useEffect, useState } from "react";
import axios from "axios";
import DonutChart from "react-donut-chart";

export default function MyComponent() {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    axios
      .get("http://127.0.0.1/badminton/src/PHP/get-datas.php")
      .then((response) => {
        setChartData(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données:", error);
      });
  }, []);

  function renderTypeDonut(data) {
    let counts = {};
    data.forEach((item) => {
      if (!counts[item.typeAdh]) {
        counts[item.typeAdh] = 0;
      }
      counts[item.typeAdh]++;
    });

    const chartData = Object.entries(counts).map(([key, value]) => ({
      value,
      label: `${key}`,
    }));

    return <DonutChart data={chartData} />;
  }

  function renderNiveauDonut(data) {
    let counts = {};
    data.forEach((item) => {
      if (!counts[item.niveauAdh]) {
        counts[item.niveauAdh] = 0;
      }
      counts[item.niveauAdh]++;
    });

    const chartData = Object.entries(counts).map(([key, value]) => ({
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
    <div>
      <div id="id_div_1">
        <h1>Type des adhérents</h1>
        {chartData.length && renderTypeDonut(chartData)}
        {chartData.length && renderNiveauDonut(chartData)}
      </div>
    </div>
  );
}
