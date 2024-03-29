import React, { useEffect, useState } from "react";
import { Button, Descriptions } from "antd";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function DetailsUser() {
  const [status, setStatus] = useState("loading");
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const id = new URLSearchParams(location.search).get("id");

  useEffect(() => {
    axios
      .get(`http://127.0.0.1/badminton/src/PHP/get-user.php?id=${id}`)
      .then((res) => {
        if (res.status === 200) {
          setUserData(res.data.user);
          setStatus("success");
        } else {
          setStatus("error");
        }
      })
      .catch((err) => {
        console.log(err);
        setStatus("error");
      });
  }, [id]);

  const handleEditClick = () => {
    navigate(`/edit-user?id=${id}`);
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  } else if (status === "success") {
    const items = [
      { label: "Nom", children: userData.nomAdh.toUpperCase() },
      {
        label: "Prénom",
        children:
          userData.prenomAdh.charAt(0).toUpperCase() +
          userData.prenomAdh.slice(1).toLowerCase(),
      },
      { label: "Adresse", children: userData.adresseAdh },
      { label: "Ville", children: userData.villeAdh },
      { label: "Code Postal", children: userData.cpAdh },
      { label: "Niveau", children: userData.niveauAdh },
      { label: "Type", children: userData.typeAdh },
    ];

    return (
      <Descriptions
        layout={"vertical"}
        title="Informations Utilisateur"
        extra={
          <Button onClick={handleEditClick} type="primary">
            Modifier
          </Button>
        }
        bordered
        // bordered ou non ?
        column={{
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 4,
        }}
        items={items}
      />
    );
  } else {
    return <div>Error loading user data.</div>;
  }
}
