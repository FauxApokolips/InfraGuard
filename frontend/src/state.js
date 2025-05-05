import React, { createContext, useState, useContext } from "react";

// ✅ Create a Context
const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <GlobalStateContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// ✅ Custom hook to use context
export const useGlobalState = () => useContext(GlobalStateContext);
