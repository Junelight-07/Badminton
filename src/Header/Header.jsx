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
  isLoggedIn: PropTypes.bool.isRequired,
};
export default function Header({ isAdmin, isLoggedIn }) {
  const navigate = useNavigate();
  const [current, setCurrent] = useState("mail");

  const onDecoButtonClick = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  const onCoButtonClick = () => {
    navigate("/login");
  };

  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  const items = [
    {
      label: <a href="/">{"Home"}</a>,
      key: "home",
      icon: <HomeFilled />,
    },
    ...(isLoggedIn
      ? [
          {
            label: <a href="/donuts-user">{"Donuts"}</a>,
            key: "donuts",
            icon: <MdAnalytics />,
          },
          {
            label: <a href="/cours">{"Cours"}</a>,
            key: "cours",
            icon: <GiTennisRacket />,
          },
        ]
      : []),
    ...(isAdmin
      ? [
          getItem(<a href="/gestion">{"Gestion"}</a>, "gestion", <FaUser />, [
            getItem(<a href="/gestion">{"Liste des adhérants"}</a>, "userList"),
            getItem(
              <a href="/search-user">{"Rechercher un adhérant"}</a>,
              "searchUser"
            ),
            getItem(
              <a href="/add-user">{"Ajouter un utilisateur"}</a>,
              "addUser"
            ),
          ]),
        ]
      : []),
    {
      label: "Navigation Three - Submenu",
      key: "SubMenu",
      icon: <SettingOutlined />,
      children: [
        {
          type: "group",
          label: "Item 1",
          children: [
            {
              label: "Option 1",
              key: "setting:1",
            },
            {
              label: "Option 2",
              key: "setting:2",
            },
          ],
        },
        {
          type: "group",
          label: "Item 2",
          children: [
            {
              label: "Option 3",
              key: "setting:3",
            },
            {
              label: "Option 4",
              key: "setting:4",
            },
          ],
        },
      ],
    },
    getItem("Navigation Two", "sub2", <AppstoreOutlined />, [
      getItem("Option 5", "5"),
      getItem("Option 6", "6"),
      getItem("Submenu", "sub3", null, [
        getItem("Option 7", "7"),
        getItem("Option 8", "8"),
      ]),
    ]),
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
        items={items}
      />
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
