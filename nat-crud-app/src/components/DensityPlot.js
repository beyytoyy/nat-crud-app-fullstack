import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RelationshipNat = ({ data }) => {
  const [chartData, setChartData] = useState(null);
  const [gradientColor, setGradientColor] = useState('#ff6600'); // Default color for gradient

  useEffect(() => {
    if (data.length === 0) return;
  
    // Extract academic performance and natResults
    const academicPerformance = data.map((item) => item.academic_performance);
    const natResults = data.map((item) => item.nat_results);
  
    // Ensure valid numeric data
    if (!academicPerformance.every((item) => !isNaN(item)) || !natResults.every((item) => !isNaN(item))) {
      console.error('Invalid data detected');
      return;
    }
  
    // Create the density plot
    const numBins = 10; // Adjust number of bins to match the range size
    const minAcademicPerformance = Math.min(...academicPerformance);
    const maxAcademicPerformance = Math.max(...academicPerformance);
    const minNatResults = Math.min(...natResults);
    const maxNatResults = Math.max(...natResults);
  
    const binWidthAcademic = (maxAcademicPerformance - minAcademicPerformance) / numBins;
    const binWidthNat = (maxNatResults - minNatResults) / numBins;
  
    const academicBins = Array(numBins).fill(0);
    const natBins = Array(numBins).fill(0);
  
    academicPerformance.forEach((value) => {
      const binIndex = Math.floor((value - minAcademicPerformance) / binWidthAcademic);
      academicBins[Math.min(binIndex, numBins - 1)] += 1;
    });
  
    natResults.forEach((value) => {
      const binIndex = Math.floor((value - minNatResults) / binWidthNat);
      natBins[Math.min(binIndex, numBins - 1)] += 1;
    });
  
    // Normalize the bins to create density
    const normalizedAcademicDensity = academicBins.map((bin) => bin / academicPerformance.length);
    const normalizedNatDensity = natBins.map((bin) => bin / natResults.length);
  
    // Prepare chart data with ranges as labels
    const xAcademic = Array.from({ length: numBins }, (_, i) => {
      const startRange = Math.round(minAcademicPerformance + i * binWidthAcademic);
      const endRange = Math.round(minAcademicPerformance + (i + 1) * binWidthAcademic);
      return `${startRange}-${endRange}`; // Create range labels like "70-80"
    });
  
    const xNat = Array.from({ length: numBins }, (_, i) => {
      const startRange = Math.round(minNatResults + i * binWidthNat);
      const endRange = Math.round(minNatResults + (i + 1) * binWidthNat);
      return `${startRange}-${endRange}`; // Create range labels for NAT Results
    });
  
    // Create gradient fills
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    const gradientAcademic = ctx.createLinearGradient(0, 0, 0, 400);
    gradientAcademic.addColorStop(0, 'rgba(31, 74, 94, 1)');
    gradientAcademic.addColorStop(1, 'rgba(26, 188, 156, 0.2)');
  
    const gradientNat = ctx.createLinearGradient(0, 0, 0, 400);
    gradientNat.addColorStop(0, 'rgba(44, 62, 80, 1)');
    gradientNat.addColorStop(1, 'rgba(51, 193, 255, 0.8)');
  
    const newChartData = {
      labels: xAcademic, // Use the range labels for the x-axis
      datasets: [
        {
          label: 'Academic Performance Density',
          data: normalizedAcademicDensity,
          fill: true,
          backgroundColor: gradientAcademic,
          borderColor: 'rgba(31, 74, 94, 1)',
          tension: 0.4,
          borderWidth: 2,
        },
        {
          label: 'NAT Results Density',
          data: normalizedNatDensity,
          fill: true,
          backgroundColor: gradientNat,
          borderColor: 'rgba(44, 62, 80, 1)',
          tension: 0.4,
          borderWidth: 2,
        },
      ],
    };
  
    setChartData(newChartData);
  }, [data, gradientColor]);
  

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: '700px', height: '400px' }}>
      {/* Chart */}
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return `Density: ${tooltipItem.raw.toFixed(3)}`;
                },
              },
              backgroundColor: '#333',
              titleColor: '#fff',
              bodyColor: '#fff',
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Value',
                color: '#333',
                font: {
                  size: 14,
                  weight: 'bold',
                },
              },
              ticks: {
                font: {
                  size: 12,
                  weight: 'bold',
                },
              },
            },
            y: {
              title: {
                display: true,
                text: 'Density',
                color: '#333',
                font: {
                  size: 14,
                  weight: 'bold',
                },
              },
              ticks: {
                font: {
                  size: 12,
                  weight: 'bold',
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default RelationshipNat;
