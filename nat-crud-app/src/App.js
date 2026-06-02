import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Button, Container, Typography } from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import GroupIcon from "@mui/icons-material/Group";
import SchoolIcon from "@mui/icons-material/School";

import Dashboard from "./components/Dashboard";
import AddNATData from "./components/AddNATData";
import NATDataList from "./components/NATDataList";

// New Color Palette
const darkTeal = "#0A3A4A";
const white = "#FFFFFF";

function App() {
  return (
    <Router>
      {/* Main layout with sidebar and main content */}
      <Container
        style={{
          display: "flex",
          padding: "0",
          maxWidth: "500vw",
          minHeight: "100vh",
          backgroundColor: "#F5FAFA",
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            width: "220px",
            backgroundColor: darkTeal,
            color: white,
            padding: "20px",
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
          }}
        >
          <Typography
            variant="h6"
            style={{ fontWeight: "bold", marginBottom: "30px", fontSize: "30px" }}
          >
            National Achievement Test
          </Typography>
          <Button
            component={Link}
            to="/"
            startIcon={<AssessmentIcon />}
            style={{
              color: white,
              display: "block",
              marginBottom: "20px",
              textTransform: "none",
            }}
          >
            Dashboard
          </Button>
          <Button
            component={Link}
            to="/add"
            startIcon={<GroupIcon />}
            style={{
              color: white,
              display: "block",
              marginBottom: "20px",
              textTransform: "none",
            }}
          >
            Add NAT Data
          </Button>
          <Button
            component={Link}
            to="/list"
            startIcon={<SchoolIcon />}
            style={{
              color: white,
              display: "block",
              marginBottom: "20px",
              textTransform: "none",
            }}
          >
            Data List
          </Button>
        </div>

        {/* Main Content Area with Routing */}
        <div style={{ marginLeft: "240px", padding: "20px", width: "calc(100% - 240px)" }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddNATData />} />
            <Route path="/list" element={<NATDataList />} />
          </Routes>
        </div>
      </Container>
    </Router>
  );
}

export default App;
