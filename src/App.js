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
import AddCours from "./AddCours/AddCours";
import DisplayCours from "./DisplayCours/DisplayCours";
import Login from "./Login/Login";
import AppContextProvider from "./Context/AppContext";
import CreateUser from "./CreateUser/CreateUser";
import Home from "./Home/Home";
import Agreement from "./Agreement/Agreement";
import Comments from "./Comments/Comments";

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
	const [isProf, setIsProf] = useState(false);
	const [idAdh, setIdAdh] = useState(null);
	const [idProf, setIdProf] = useState(null);

	useEffect(() => {
		if (token) {
			const decodedToken = jwtDecode(token);
			setIsLoggedIn(!!decodedToken);
			// le token est à décoder dans un fichier php
			setIsAdmin(decodedToken?.type === "administrateur");
			setIsProf(decodedToken?.type === "professeur");
			setIdAdh(decodedToken.idAdh);
			setIdProf(decodedToken.idProf);
		}
	}, [token]);

	return (
		<BrowserRouter>
			{<Header isAdmin={isAdmin} isLoggedIn={isLoggedIn} isProf={isProf} />}
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/home" element={<Home />} />
				{isLoggedIn && <Route path="/donuts-user" element={<DonutsUser />} />}
				{isLoggedIn && (
					<Route path="/cours" element={<DisplayCours idAdh={idAdh} />} />
				)}
				{isLoggedIn && (
					<Route
						path="/cours/commentaires"
						element={<Comments idAdh={idAdh} />}
					/>
				)}
				{(isAdmin || isProf) && (
					<Route
						path="/add-cours"
						element={<AddCours isAdmin={isAdmin} idProf={idProf} />}
					/>
				)}
				{(isAdmin || isProf) && (
					<Route path="/gestion" element={<Gestion isAdmin={isAdmin} />} />
				)}
				{isAdmin && <Route path="/delete-user" element={<DeleteUser />} />}
				{isAdmin && <Route path="/edit-user" element={<EditUser />} />}
				{isAdmin && <Route path="/details-user" element={<DetailsUser />} />}
				{isAdmin && <Route path="/search-user" element={<SearchUser />} />}
				{isAdmin && <Route path="/add-user" element={<AddUser />} />}
				<Route path="/login" element={<Login />} />
				<Route path="/create-user" element={<CreateUser />} />
				<Route path="/agreement" element={<Agreement />} />
				{/* <Route path="*" element={<Navigate to="/login" />} /> */}
			</Routes>
			{/*<Footer />*/}
		</BrowserRouter>
	);
}
