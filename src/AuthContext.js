import React, { createContext, useEffect, useState } from "react";
import { auth } from "./config/fire";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const setUser = (user) => {
    setCurrentUser(user);
  };

  return (
    <AuthContext.Provider value={{ currentUser, setUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
