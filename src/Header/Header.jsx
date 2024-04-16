import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Menu } from "antd";
import { FaUser } from "react-icons/fa";
import { MdAnalytics, MdLogin, MdLogout } from "react-icons/md";
import { GiTennisRacket } from "react-icons/gi";
import {
  AppstoreOutlined,
  HomeFilled,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

Header.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  isProf: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};

export default function Header({ isAdmin, isProf, isLoggedIn }) {
  const navigate = useNavigate();
  const [current, setCurrent] = useState("home");

  const onDecoButtonClick = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  const onCoButtonClick = () => {
    navigate("/login");
  };

  function getItem(label, key, icon, type = null) {
    return (
      <Menu.Item key={key} icon={icon} type={type}>
        {label}
      </Menu.Item>
    );
  }

  const items = [
    getItem(<a href="/">{"Accueil"}</a>, "home", <HomeFilled />),
    ...(isLoggedIn
      ? [
          getItem(
            <a href="/donuts-user">{"Donuts"}</a>,
            "donuts",
            <MdAnalytics />,
          ),
        ]
      : []),
    ...(isLoggedIn
      ? [
          <Menu.SubMenu
            key="Cours"
            icon={<GiTennisRacket />}
            title={<a href="/cours">{"Cours"}</a>}
          >
            {(isAdmin || isProf) &&
              getItem(
                <a href="/add-cours">{"Ajouter un cours"}</a>,
                "addCours",
              )}

            {!isAdmin &&
              !isProf &&
              getItem(
                <a href="/cours/commentaires">{"Mes cours à noter"}</a>,
                "commentaires",
              )}
          </Menu.SubMenu>,
        ]
      : []),
    ...(isAdmin || isProf
      ? [
          <Menu.SubMenu
            key="gestion"
            icon={<FaUser />}
            title={<a href="/gestion">{"Gestion"}</a>}
          >
            {getItem(
              <a href="/gestion">{"Liste des adhérants"}</a>,
              "userList",
            )}
            {isAdmin &&
              getItem(
                <a href="/search-user">{"Rechercher un adhérant"}</a>,
                "searchUser",
              )}
            {isAdmin &&
              getItem(
                <a href="/add-user">{"Ajouter un adhérant"}</a>,
                "addUser",
              )}
          </Menu.SubMenu>,
        ]
      : []),
    <Menu.SubMenu
      key="subMenu"
      title="Navigation Three - Sous-menu"
      icon={<SettingOutlined />}
    >
      <Menu.ItemGroup key="group1" title="Item 1">
        {getItem("Option 1", "setting:1")}
        {getItem("Option 2", "setting:2")}
      </Menu.ItemGroup>
      <Menu.ItemGroup key="group2" title="Item 2">
        {getItem("Option 3", "setting:3")}
        {getItem("Option 4", "setting:4")}
      </Menu.ItemGroup>
    </Menu.SubMenu>,
    getItem("Navigation Two", "sub2", <AppstoreOutlined />, "subMenu"),
  ];

  const onClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <header style={{ display: "flex", justifyContent: "space-between" }}>
      <Menu
        style={{ width: "50vw" }}
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
      >
        {items}
      </Menu>
      {isLoggedIn ? (
        <Button
          type="primary"
          shape="round"
          icon={<MdLogout />}
          onClick={onDecoButtonClick}
        >
          {"Se déconnecter"}
        </Button>
      ) : (
        <Button
          type="primary"
          shape="round"
          icon={<MdLogin />}
          onClick={onCoButtonClick}
        >
          {"Se connecter"}
        </Button>
      )}
    </header>
  );
}
