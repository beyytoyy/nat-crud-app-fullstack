import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, DoughnutController } from "chart.js";

// Register chart components
ChartJS.register(ArcElement, Tooltip, Legend, Title, DoughnutController);

const DonutChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const NATCollection = collection(db, "NATData");
      const NATSnapshot = await getDocs(NATCollection);
      const dataList = NATSnapshot.docs.map((doc) => doc.data());

      // Process the data by categorizing academicPerformance into ranges
      const performanceCounts = {
        "Low Performance (0-74)": 0,
        "Average Performance (75-89)": 0,
        "High Performance (90-100)": 0,
      };

      dataList.forEach((data) => {
        const { academicPerformance } = data;

        if (academicPerformance <= 74) {
          performanceCounts["Low Performance (0-74)"]++;
        } else if (academicPerformance >= 75 && academicPerformance <= 89) {
          performanceCounts["Average Performance (75-89)"]++;
        } else if (academicPerformance >= 90) {
          performanceCounts["High Performance (90-100)"]++;
        }
      });

      const ctx = document.createElement('canvas').getContext('2d'); // Create a temporary canvas for gradients
      const gradientBelow = ctx.createLinearGradient(0, 0, 0, 400);
      gradientBelow.addColorStop(0, '#1F4A5E'); // Darker teal
      gradientBelow.addColorStop(1, '#1ABC9C'); // Lighter teal

      const gradientOn = ctx.createLinearGradient(0, 0, 200, 400);
      gradientOn.addColorStop(0, '#2C3E50'); // Darker blue-grey
      gradientOn.addColorStop(1, '#33C1FF'); // Lighter blue

      const gradientAbove = ctx.createLinearGradient(0, 0, 10, 400);
      gradientAbove.addColorStop(0, '#16A085'); // Darker greenish teal
      gradientAbove.addColorStop(1, '#70FF83'); // Lighter green

      setChartData({
        labels: [
          "Low Performance (0-74)",
          "Average Performance (75-89)",
          "High Performance (90-100)",
        ],
        datasets: [
          {
            label: "Count of Students by Academic Performance",
            data: Object.values(performanceCounts),
            backgroundColor: [gradientBelow, gradientOn, gradientAbove], // Use gradients for each segment
            hoverBackgroundColor: [gradientBelow, gradientOn, gradientAbove],
            borderColor: '#FFFFFF', // White borders between segments
            borderWidth: 5, // Width of the borders between segments
          },
        ],
      });

      setLoading(false);
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "50%",
    plugins: {
      legend: {
        position: "bottom",
        align: "start",
        labels: {
          font: {
            size: 14,
            weight: "bold",
            family: "'Arial', sans-serif",
          },
          padding: 10,
          boxWidth: 15,
          boxHeight: 15,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleColor: "#fff",
        bodyColor: "#fff",
        callbacks: {
          label: function (tooltipItem) {
            const total = tooltipItem.chart.data.datasets[0].data.reduce(
              (sum, value) => sum + value,
              0
            );
            const percentage = ((tooltipItem.raw / total) * 100).toFixed(2);
            return `${tooltipItem.label}: ${percentage}%`;
          },
        },
      },
    },
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  // Only render the Doughnut chart when data is ready
  return chartData ? (
    <div
      style={{
        display: "flex",
        height: "350px",
        width: "250px",
        padding: "15px",
        marginLeft: "-22px",
        marginTop: "-20px",
      }}
    >
      <Doughnut data={chartData} options={options} />
    </div>
  ) : (
    <p>No data available</p>
  );
};

export default DonutChart;
