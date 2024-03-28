import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

const AppContext = React.createContext({ isLoggedIn: false, isAdmin: false });

export const useAppContext = () => useContext(AppContext);

AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default function AppContextProvider({ children }) {
  const token = localStorage.getItem("token");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!token);
    setIsAdmin(token === "admin-token");
  }, []);

  return (
    <AppContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        isAdmin: isAdmin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
