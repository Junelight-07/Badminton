import React, { useEffect, useState } from "react";
import styles from "./Home.module.scss";
import { Card, message, Statistic } from "antd";
import { LikeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const { Meta } = Card;
  const [datas, setDatas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post("http://127.0.0.1/badminton/src/PHP/home.php")
      .then((res) => {
        if (res.data.status === "done") {
          setDatas(res.data);
        } else if (res.data.status === "error") {
          console.error(res.data.message);
        } else {
          console.error("Invalid data", res.data);
        }
      })
      .catch((error) => {
        message.error(
          "An error occurred while trying to fetch the datas",
          error,
        );
      });
  }, []);
  console.log("datas", datas);
  const Card1 = ({ title, description, imageUrl }) => (
    <Card
      hoverable
      style={{
        width: 240,
      }}
      cover={<img alt="example" src={imageUrl} />}
    >
      <Meta title={title} description={description} />
    </Card>
  );

  return (
    <>
      <div className={styles.container}>
        <p className={styles.AnimText}>{"BADMINTON"}</p>
      </div>
      <div>
        <div className={styles.TextCard}>
          <p>{"EN APPRENDRE PLUS SUR NOUS"}</p>
        </div>
        <div className={styles.OrgaCard}>
          <Statistic
            title="Ils nous font confiance"
            value={datas.total_comments}
            prefix={<LikeOutlined />}
          />
          <Statistic title="Unmerged" value={93} suffix="/ 100" />
        </div>
      </div>
      <div>
        <div className={styles.TextCard}>
          <p>{"ABONNEMENTS"}</p>
        </div>
        <div className={styles.OrgaCard}>
          <div
            onClick={() => {
              navigate("/create-user?type=Étudiant");
            }}
          >
            <Card1
              title="ETUDIANT"
              description="5.99 € / MOIS"
              imageUrl="/Image/etudiant.jpg"
            />
          </div>
          <div
            onClick={() => {
              navigate("/create-user?type=Salarié");
            }}
          >
            <Card1
              title="SALARIE"
              description="14.99 € / MOIS"
              imageUrl="/Image/salarie.jpg"
            />
          </div>
          <div
            onClick={() => {
              navigate("/create-user?type=Retraité");
            }}
          >
            <Card1
              title="RETRAITE"
              description="21.99 € / MOIS"
              imageUrl="/Image/retraite.jpg"
            />
          </div>
        </div>
      </div>
      <div className={styles.DescTerrain}>
        <img src="/Image/terrain1.jpg" alt="cours de badminton" />
        <p>
          Le premier cours de badminton s'étend sur une longueur de 13,4 mètres
          et une largeur de 5,18 mètres pour les matchs en simple. Pour les
          matchs en double, la largeur s'élargit à 6,1 mètres. Les lignes de
          terrain sont marquées en blanc avec une largeur de 40 millimètres,
          délimitant clairement la zone de jeu, y compris les lignes de service,
          les lignes de côté et les lignes de fond. Au centre du terrain, un
          filet est suspendu à une hauteur de 1,55 mètre pour les matchs en
          simple et de 1,524 mètre pour les matchs en double.
        </p>
      </div>

      <div className={styles.DescTerrain}>
        <p>
          Le deuxième cours de badminton, quant à lui, mesure 12 mètres de
          longueur et 6 mètres de largeur, adapté aux matchs en simple ou en
          double. Les lignes de terrain sont marquées en jaune avec une largeur
          de 50 millimètres, offrant une délimitation claire de la zone de jeu,
          comprenant les lignes de service, les lignes de côté et les lignes de
          fond. Le filet, au centre du terrain, est suspendu à une hauteur de
          1,5 mètre pour les matchs en simple et de 1,55 mètre pour les matchs
          en double, permettant ainsi des conditions de jeu optimales pour les
          joueurs.
        </p>
        <img src="/Image/terrain2.jpg" alt="cours de badminton" />
      </div>
    </>
  );
}
