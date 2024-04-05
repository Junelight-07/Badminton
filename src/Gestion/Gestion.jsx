import React, { useEffect, useState, useRef } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Input, Popconfirm, Space, Table, Tooltip } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

export default function Gestion() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters, dataIndex, confirm) => {
    clearFilters();
    handleSearch([""], confirm, dataIndex);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            {"Search"}
          </Button>
          <Button
            onClick={() =>
              clearFilters && handleReset(clearFilters, dataIndex, confirm)
            }
            size="small"
            style={{
              width: 90,
            }}
          >
            {"Reset"}
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            {"close"}
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "Nom de l'adhérent",
      dataIndex: "nomAdh",
      key: "nomAdh",
      render: (text) => text.toUpperCase(),
      ...getColumnSearchProps("nomAdh"),
      sorter: (a, b) => a.nomAdh.localeCompare(b.nomAdh),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Prénom de l'adhérent",
      dataIndex: "prenomAdh",
      key: "prenomAdh",
      render: (text) =>
        text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
      ...getColumnSearchProps("prenomAdh"),
      sorter: (a, b) => a.prenomAdh.localeCompare(b.prenomAdh),
      sortDirections: ["descend", "ascend"],
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
