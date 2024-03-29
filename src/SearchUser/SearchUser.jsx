import React, { useState } from "react";
import { Avatar, Button, Form, Input, List } from "antd";
import VirtualList from "rc-virtual-list";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SearchUser() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState({});
  const navigate = useNavigate();

  const handleSearch = async (values) => {
    const { search } = values;
    setSearchQuery(search);
    try {
      const response = await axios.get(
        `http://127.0.0.1/badminton/src/PHP/search-user.php?search=${search}`,
      );
      setSearchResult(response.data.users);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const handleEditClick = (event, id) => {
    event.preventDefault();
    navigate(`/edit-user?id=${id}`);
  };

  function renderItem(el) {
    return (
      <div>
        {el.adresseAdh} {el.cpAdh} {el.villeAdh} <br /> {el.niveauAdh}
        <br /> {el.typeAdh}
      </div>
    );
  }

  return (
    <>
      <Form layout="inline" onFinish={handleSearch}>
        <Form.Item name="search">
          <Input placeholder="Rechercher un utilisateur" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {"Rechercher"}
          </Button>
        </Form.Item>
      </Form>

      {searchResult?.length ? (
        <List>
          <VirtualList data={searchResult} itemHeight={47} itemKey="idAdh">
            {(item, index) => (
              <List.Item key={item.idAdh}>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                    />
                  }
                  title={
                    <div>
                      {item.prenomAdh.charAt(0).toUpperCase() +
                        item.prenomAdh.slice(1).toLowerCase()}{" "}
                      {item.nomAdh.toUpperCase()}
                    </div>
                  }
                  description={renderItem(item)}
                />
                <Button
                  onClick={(event) => {
                    handleEditClick(event, item.idAdh);
                  }}
                  type="primary"
                >
                  {"Modifier"}
                </Button>
              </List.Item>
            )}
          </VirtualList>
        </List>
      ):(
        <div>{"Cet adhérent n'existe pas mon cher !"}</div>
      )}
    </>
  );
}
