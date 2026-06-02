import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { db } from "../firebase"; // Adjust the import path based on your file structure
import {
  TextField,
  Button,
  Container,
  Grid,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Typography,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close'; // Import Close icon
import SchoolIcon from '@mui/icons-material/School';
import AssessmentIcon from '@mui/icons-material/Assessment';
import GroupIcon from '@mui/icons-material/Group';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddNATData = () => {
  const [respondents, setRespondent] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [ethnic, setEthnic] = useState("");
  const [academicPerformance, setAcademicPerformance] = useState("");
  const [academicDescription, setAcademicDescription] = useState("");
  const [iq, setIq] = useState("");
  const [typeSchool, setTypeSchool] = useState("");
  const [socioEconomicStatus, setSocioEconomicStatus] = useState("");
  const [studyHabit, setStudyHabit] = useState("");
  const [natResults, setNatResults] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false); // Snackbar state

  // New Color Palette
  const darkBlue = "#2C3E50"; // A deep, rich blue
  const mediumBlue = "#2980B9"; // A bold blue for accents
  const cyanBlue = "#16A085"; // A vibrant teal-blue for balance
  const lightCyan = "#1ABC9C"; // A light cyan color for highlighting
  const veryLightGray = "#ECF0F1"; // Soft gray for the background
  const warmOrange = "#E67E22"; // A warm orange for contrasts
  const white = "#ffffff"; // Clean white for text and elements

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "NATData"), { // Ensure collection name matches
        respondents,
        age: Number(age),
        sex,
        ethnic,
        academicPerformance,
        academicDescription,
        iq, // No need to convert to Number since it's a string ("High" or "Low")
        typeSchool,
        socioEconomicStatus,
        studyHabit,
        natResults,
      });
      // Clear input fields after submission
      setRespondent("");
      setAge("");
      setSex("");
      setEthnic("");
      setAcademicPerformance("");
      setAcademicDescription("");
      setIq("");
      setTypeSchool("");
      setSocioEconomicStatus("");
      setStudyHabit("");
      setNatResults("");
      setSnackBarOpen(true); // Show success message
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleCloseSnackBar = () => {
    setSnackBarOpen(false);
  };

  return (
    <Container maxWidth="lg" style={{ display: "flex", padding: "50px", backgroundColor: veryLightGray }}>
      {/* Main Content */}
      <div style={{ margin: "auto", width: "calc(100% - 240px)", padding: "20px" }}>
        <Typography variant="h4" gutterBottom align="center" style={{ color: "#125A80", fontWeight: "bold" }}>
          Add National Achievement Test Data
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Respondents"
                value={respondents}
                onChange={(e) => setRespondent(e.target.value)}
                required
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required variant="outlined">
                <InputLabel>Sex</InputLabel>
                <Select
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                >
                  <MenuItem value={"Male"}>Male</MenuItem>
                  <MenuItem value={"Female"}>Female</MenuItem>
                  <MenuItem value={"Other"}>Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Ethnic"
                value={ethnic}
                onChange={(e) => setEthnic(e.target.value)}
                required
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Academic Performance"
                value={academicPerformance}
                onChange={(e) => setAcademicPerformance(e.target.value)}
                required
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Academic Description"
                value={academicDescription}
                onChange={(e) => setAcademicDescription(e.target.value)}
                required
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required variant="outlined">
                <InputLabel>IQ</InputLabel>
                <Select
                  value={iq}
                  onChange={(e) => setIq(e.target.value)}
                >
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required variant="outlined">
                <InputLabel>Type of School</InputLabel>
                <Select
                  value={typeSchool}
                  onChange={(e) => setTypeSchool(e.target.value)}
                >
                  <MenuItem value={"Public"}>Public</MenuItem>
                  <MenuItem value={"Private"}>Private</MenuItem>
                  <MenuItem value={"Charter"}>Charter</MenuItem>
                  <MenuItem value={"Home Schooling"}>Home Schooling</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Socio-Economic Status"
                value={socioEconomicStatus}
                onChange={(e) => setSocioEconomicStatus(e.target.value)}
                required
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Study Habit"
                value={studyHabit}
                onChange={(e) => setStudyHabit(e.target.value)}
                required
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="NAT Results"
                value={natResults}
                onChange={(e) => setNatResults(e.target.value)}
                required
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit" style={{ width: "100%" }}>
                Add Data
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Snackbar for success messages */}
        <Snackbar open={snackBarOpen} autoHideDuration={6000} onClose={handleCloseSnackBar}>
          <Alert onClose={handleCloseSnackBar} severity="success" sx={{ width: '100%' }}>
            Data added successfully!
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseSnackBar}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Alert>
        </Snackbar>
      </div>
    </Container>
  );
};

export default AddNATData;
