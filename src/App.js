import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Header/Header";
import DonutsUser from "./DonutsUser/DonutsUser";
import Gestion from "./Gestion/Gestion";
import DeleteUser from "./DeleteUser/DeleteUser";
import EditUser from "./EditUser/EditUser";
import DetailsUser from "./DetailsUser/DetailsUser";
import SearchUser from "./SearchUser/SearchUser";
import AddUser from "./AddUser/AddUser";
import DisplayCours from "./DisplayCours/DisplayCours";
import Login from "./Login/Login";
import AppContextProvider from "./Context/AppContext";
import CreateUser from "./CreateUser/CreateUser";
import Home from "./Home/Home";

export default function App() {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
}

function AppContent() {
  const token = localStorage.getItem("token");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setIsLoggedIn(!!decodedToken);
      setIsAdmin(decodedToken?.type === "administrateur");
    }
  }, [token]);

  return (
    <BrowserRouter>
      {isLoggedIn && <Header isAdmin={isAdmin} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        {isLoggedIn && <Route path="/donuts-user" element={<DonutsUser />} />}
        {isLoggedIn && <Route path="/cours" element={<DisplayCours />} />}
        {isAdmin && <Route path="/gestion" element={<Gestion />} />}
        {isAdmin && <Route path="/delete-user" element={<DeleteUser />} />}
        {isAdmin && <Route path="/edit-user" element={<EditUser />} />}
        {isAdmin && <Route path="/details-user" element={<DetailsUser />} />}
        {isAdmin && <Route path="/search-user" element={<SearchUser />} />}
        {isAdmin && <Route path="/add-user" element={<AddUser />} />}
        <Route path="/login" element={<Login />} />
        <Route path="/create-user" element={<CreateUser />} />
        {/*<Route path="*" element={<Navigate to="/login" />} />*/}
      </Routes>
      {/*<Footer />*/}
    </BrowserRouter>
  );
}
