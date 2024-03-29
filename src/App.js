import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Header/Header";
import Home from "./Home/Home";
import Gestion from "./Gestion/Gestion";
import DeleteUser from "./DeleteUser/DeleteUser";
import EditUser from "./EditUser/EditUser";
import DetailsUser from "./DetailsUser/DetailsUser";
import SearchUser from "./SearchUser/SearchUser";
import AddUser from "./AddUser/AddUser";
import Login from "./Login/Login";
import CreateUser from "./CreateUser/CreateUser";
import AppContextProvider, { useAppContext } from "./Context/AppContext";

export default function App() {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
}

function AppContent() {
  const { isLoggedIn, isAdmin } = useAppContext();

  return (
    <BrowserRouter>
      {isLoggedIn && <Header isAdmin={isAdmin} />}
      <Routes>
        {isLoggedIn && <Route path="/" element={<Home />} />}
        {isLoggedIn && <Route path="/home" element={<Home />} />}
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
