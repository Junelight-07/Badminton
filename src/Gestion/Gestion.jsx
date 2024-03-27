import React, { useEffect, useState } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Table } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Gestion() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
  };

  const columns = [
    {
      title: "Nom de l'adhérent",
      dataIndex: "nomAdh",
      key: "nomAdh",
      render: (text) => text.toUpperCase(),
    },
    {
      title: "Prénom de l'adhérent",
      dataIndex: "prenomAdh",
      key: "prenomAdh",
      render: (text) =>
        text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="default"
            href={`/details-user?id=${record.idAdh}`}
            block
          >
            {"Détails"}
          </Button>
          <Popconfirm
            title={`Delete the user ${record.idAdh} ?`}
            description={`Are you sure to delete the user ${record.nomAdh.toUpperCase()} ?`}
            icon={
              <QuestionCircleOutlined
                style={{
                  color: "red",
                }}
              />
            }
            onConfirm={() => {
              navigate(`/delete-user?id=${record.idAdh}`);
            }}
          >
            <Button danger>{"Supprimer"}</Button>
          </Popconfirm>
          <Button
            type="primary"
            ghost
            href={`/edit-user?id=${record.idAdh}`}
            block
          >
            {"Modifier"}
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    axios
      .get("http://127.0.0.1/badminton/src/PHP/get-datas.php")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données:", error);
      });
  }, []);

  return <Table columns={columns} dataSource={data} rowKey={data.idAdh} />;
}
