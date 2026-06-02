import React from "react";
import AddNATData from "../src/components/AddNATData"; // Ensure the correct component is imported
import NATDataList from "../src/components/NATDataList"; // Ensure the correct component is imported

function App() {
  return (
    <div className="App">
      <h1>NAT Data CRUD App</h1>
      <AddNATData /> {/* Corrected the component name */}
      <NATDataList /> {/* Corrected the component name */}
    </div>
  );
}

export default App;
