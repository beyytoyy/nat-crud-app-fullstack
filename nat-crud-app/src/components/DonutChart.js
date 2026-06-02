import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, DoughnutController } from "chart.js";

// Register chart components
ChartJS.register(ArcElement, Tooltip, Legend, Title, DoughnutController);

const DonutChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const NATCollection = collection(db, "NATData");
      const NATSnapshot = await getDocs(NATCollection);
      const dataList = NATSnapshot.docs.map((doc) => doc.data());

      // Process the data to calculate the average NAT score for each socio-economic status
      const socioEconomicCounts = {
        "Below Poverty Line": 0,
        "On Poverty Line": 0,
        "Above Poverty Line": 0,
      };
      const socioEconomicScores = {
        "Below Poverty Line": 0,
        "On Poverty Line": 0,
        "Above Poverty Line": 0,
      };

      // Categorize data by socio-economic status and sum NAT scores
      dataList.forEach((data) => {
        const { socioEconomicStatus, natResults } = data;

        if (socioEconomicStatus === "Below poverty line") {
          socioEconomicCounts["Below Poverty Line"]++;
          socioEconomicScores["Below Poverty Line"] += natResults;
        } else if (socioEconomicStatus === "On poverty line") {
          socioEconomicCounts["On Poverty Line"]++;
          socioEconomicScores["On Poverty Line"] += natResults;
        } else if (socioEconomicStatus === "Above poverty line") {
          socioEconomicCounts["Above Poverty Line"]++;
          socioEconomicScores["Above Poverty Line"] += natResults;
        }
      });

      // Calculate average NAT score per socio-economic group
      const averageScores = {
        "Below Poverty Line": socioEconomicScores["Below Poverty Line"] / socioEconomicCounts["Below Poverty Line"],
        "On Poverty Line": socioEconomicScores["On Poverty Line"] / socioEconomicCounts["On Poverty Line"],
        "Above Poverty Line": socioEconomicScores["Above Poverty Line"] / socioEconomicCounts["Above Poverty Line"],
      };

      // Calculate the total of all groups to determine the percentage
      const total = Object.values(socioEconomicCounts).reduce((acc, curr) => acc + curr, 0);

      // Set up chart data with labels and average NAT scores per socio-economic status
      const ctx = document.createElement('canvas').getContext('2d'); // Create a temporary canvas for gradients
      const gradientBelow = ctx.createLinearGradient(0, 0, 10, 400);
      gradientBelow.addColorStop(0, '#1F4A5E'); // Darker teal
      gradientBelow.addColorStop(1, '#1ABC9C'); // Lighter teal

      const gradientOn = ctx.createLinearGradient(0, 0, 10, 400);
      gradientOn.addColorStop(0, '#2C3E50'); // Darker blue-grey
      gradientOn.addColorStop(1, '#33C1FF'); // Lighter blue

      const gradientAbove = ctx.createLinearGradient(0, 0, 10, 400);
      gradientAbove.addColorStop(0, '#16A085'); // Darker greenish teal
      gradientAbove.addColorStop(1, '#70FF83'); // Lighter green

      setChartData({
        labels: ["Below Poverty Line", "On Poverty Line", "Above Poverty Line"],
        datasets: [
          {
            label: "Average NAT Scores by Socio-Economic Status",
            data: [
              socioEconomicCounts["Below Poverty Line"],
              socioEconomicCounts["On Poverty Line"],
              socioEconomicCounts["Above Poverty Line"],
            ],
            backgroundColor: [gradientBelow, gradientOn, gradientAbove], // Use gradients for each segment
            hoverBackgroundColor: [gradientBelow, gradientOn, gradientAbove],
            borderColor: '#FFFFFF', // White borders between segments
            borderWidth: 5, // Width of the borders between segments
          },
        ],
      });
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '50%', // Adjust the size of the donut hole
    plugins: {
      legend: {
        position: 'bottom',
        align: 'start',
        labels: {
          font: {
            size: 14,
            weight: 'bold',
            family: "'Arial', sans-serif",
          },
          padding: 10, // Increase space around the legend items
          boxWidth: 15,  // Set the width of the color box (rectangle)
          boxHeight: 15, // Set the height of the color box (rectangle)
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
          label: function (tooltipItem) {
            const total = tooltipItem.chart.data.datasets[0].data.reduce((sum, value) => sum + value, 0);
            const percentage = ((tooltipItem.raw / total) * 100).toFixed(2);
            return `${tooltipItem.label}: ${percentage}%`;
          },
        },
      },
    },
  };

  return (
    <div style={{
      display: 'flex',
      height: '350px', // Increased height for better view
      width: '250px', // Adjust width for better responsiveness
      padding: '15px',
      marginLeft: '-22px',
      marginTop: '-20px'
    }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default DonutChart;
