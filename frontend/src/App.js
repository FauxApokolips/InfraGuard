import React, { useState } from "react";
import Dashboard from "./Dashboard";  // ✅ Import Dashboard component
import './App.css';
import './styles.css';


const App = () => {
  const [activeTab, setActiveTab] = useState("home"); // ✅ Define state in App.js

  return <Dashboard setActiveTab={setActiveTab} />; // ✅ Pass it as a prop
};

export default App;
