import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Header from "./Header/Header";
import Home from "./Home/Home";
import Gestion from "./Gestion/Gestion";
import DeleteUser from "./DeleteUser/DeleteUser";
import EditUser from "./EditUser/EditUser";
import UserDetails from "./DisplayUser/DisplayUser";
import SearchUser from "./SearchUser/SearchUser";
import AddUser from "./AddUser/AddUser";
import Login from "./Login/Login";
import CreateUser from "./CreateUser/CreateUser";

export default function App() {
  let token = localStorage.getItem("token");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  console.log("token1", token);

  useEffect(() => {
    console.log("token2", token);
    setIsLoggedIn(!!token);
    setIsAdmin(token === "admin-token");
  }, [token]);

  return (
    <Router>
      {isLoggedIn && <Header isAdmin={isAdmin} isLoggedIn={isLoggedIn} />}
      <Routes>
        {isLoggedIn && <Route path="/" element={<Home />} />}
        {isLoggedIn && <Route path="/home" element={<Home />} />}
        {isAdmin && <Route path="/gestion" element={<Gestion />} />}
        {isAdmin && <Route path="/delete-user" element={<DeleteUser />} />}
        {isAdmin && <Route path="/edit-user" element={<EditUser />} />}
        {isAdmin && <Route path="/details-user" element={<UserDetails />} />}
        {isAdmin && <Route path="/search-user" element={<SearchUser />} />}
        {isAdmin && <Route path="/add-user" element={<AddUser />} />}
        <Route path="/login" element={<Login />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      {/*<Footer />*/}
    </Router>
  );
}
