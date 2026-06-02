import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Card, CardContent } from "@mui/material";
import DistributionNat from "./DonutChart.js";
import ComparisonNat from "./Histogram.js";
import RelationshipNat from "./DensityPlot.js";
import BarChartComponents from "./DoughnutChart.js";
import ViolinPlot from "./violinPlot.js";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function Dashboard() {
  const [NATData, setNATData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/nat`);

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        setNATData(data);
      } catch (err) {
        console.error("Failed to fetch NAT data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Summary calculations
  const totalRecords = NATData.length;

  const averageNATScore = 
    NATData.length > 0
      ? NATData.reduce(
          (acc, item) => acc + parseFloat(item.nat_results),
          0
        ) / NATData.length
      : 0;

  const maxNATScore =
    NATData.length > 0
      ? Math.max(...NATData.map((item) => parseFloat(item.nat_results)))
      : 0;

  const minNATScore =
    NATData.length > 0
      ? Math.min(...NATData.map((item) => parseFloat(item.nat_results)))
      : 0;

  // Loading state
  if (loading) {
    return (
      <Container
        maxWidth={false}
        disableGutters
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#F5FAFA",
        }}
      >
        <Typography variant="h6" style={{ color: "#0A3A4A" }}>
          Loading dashboard data...
        </Typography>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container
        maxWidth={false}
        disableGutters
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#F5FAFA",
        }}
      >
        <Typography variant="h6" style={{ color: "red" }}>
          Error loading data: {error}. Make sure your backend server is running.
        </Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth={false}
      disableGutters
      style={{
        width: "calc(100vw - 300px)",
        minHeight: "100vh",
        backgroundColor: "#F5FAFA",
        padding: "20px",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        style={{
          marginTop: "-20px",
          marginBottom: "20px",
          fontWeight: "bold",
          color: "#0A3A4A",
        }}
      >
        Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} style={{ marginBottom: "30px", width: "100%" }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card style={{ backgroundColor: "#0A3A4A", padding: "10px 0", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
            <CardContent>
              <Typography variant="h6" style={{ fontWeight: "bold", color: "white" }}>Total Records</Typography>
              <Typography variant="h4" style={{ color: "white" }}>{totalRecords}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card style={{ backgroundColor: "#0A3A4A", padding: "10px 0", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
            <CardContent>
              <Typography variant="h6" style={{ fontWeight: "bold", color: "white" }}>Average NAT Score</Typography>
              <Typography variant="h4" style={{ color: "white" }}>{averageNATScore.toFixed(2)}%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card style={{ backgroundColor: "#0A3A4A", padding: "10px 0", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
            <CardContent>
              <Typography variant="h6" style={{ fontWeight: "bold", color: "white" }}>Maximum NAT Score</Typography>
              <Typography variant="h4" style={{ color: "white" }}>{maxNATScore}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card style={{ backgroundColor: "#0A3A4A", padding: "10px 0", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
            <CardContent>
              <Typography variant="h6" style={{ fontWeight: "bold", color: "white" }}>Minimum NAT Score</Typography>
              <Typography variant="h4" style={{ color: "white" }}>{minNATScore}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} style={{ marginBottom: "30px" }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" style={{ marginBottom: "10px", fontWeight: "bold", color: "#0A3A4A" }}>
            Distribution of NAT Results by Socio-Economic Status
          </Typography>
          <Card style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)", borderRadius: "8px", padding: "20px", backgroundColor: "white", height: "350px", width: "790px" }}>
            <ComparisonNat data={NATData} />
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)", borderRadius: "8px", padding: "20px", backgroundColor: "white", width: "246.562px", height: "350px", marginLeft: "261px", marginTop: "40px" }}>
            <DistributionNat data={NATData} />
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" style={{ marginBottom: "10px", fontWeight: "bold", color: "#0A3A4A" }}>
            Academic Performance vs NAT Results
          </Typography>
          <Card style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)", borderRadius: "8px", padding: "20px", backgroundColor: "white", height: "400px", width: "790px" }}>
            <RelationshipNat data={NATData} />
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)", borderRadius: "8px", padding: "20px", backgroundColor: "white", width: "246.562px", height: "400px", marginLeft: "261px", marginTop: "40px" }}>
            <BarChartComponents data={NATData} />
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" style={{ marginBottom: "10px", fontWeight: "bold", color: "#0A3A4A" }}>
            Distribution of NAT Results between Gender
          </Typography>
          <Card style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)", borderRadius: "8px", padding: "20px", backgroundColor: "white", height: "500px", width: "790px" }}>
            <ViolinPlot
              data={NATData}
              style={{ width: "100%", height: "400px" }}
              margin={{ top: 10, right: 10, bottom: 30, left: 40 }}
              innerWidth={500}
            />
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;