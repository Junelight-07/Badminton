import { useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { message } from "antd";

export default function DeleteUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const id = new URLSearchParams(location.search).get("id");

  useEffect(() => {
    axios
      .get(`http://127.0.0.1/badminton/src/PHP/delete-user.php?id=${id}`)
      .then((res) => {
        if (res.status === 200) {
          message.success(`User ${id} has been deleted successfully`);
          navigate("/gestion");
        } else {
          message.error(`Error updating user ${id}`);
        }
      })
      .catch((err) => {
        message.error(`Error ${err}`);
      });
  }, [id, navigate]);
}
