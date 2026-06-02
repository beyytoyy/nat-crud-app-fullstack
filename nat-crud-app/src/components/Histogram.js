import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const BarChartComponent = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null); // Ref to store the chart instance

  // Helper function to bucketize NAT results into ranges
  const bucketizeData = (natResults, ranges) => {
    const buckets = new Array(ranges.length - 1).fill(0);
    natResults.forEach(result => {
      for (let i = 0; i < ranges.length - 1; i++) {
        if (result >= ranges[i] && result < ranges[i + 1]) {
          buckets[i] += 1;
          break;
        }
      }
    });
    return buckets;
  };

  useEffect(() => {
    if (!chartRef.current) return;

    // Define score ranges
    const ranges = [20, 40, 60, 80, 100];
    const labels = ranges.slice(0, -1).map((start, index) => `${start}-${ranges[index + 1]}`);

    // Categorize data and bucketize it by socio-economic status
    const belowPovertyLineData = bucketizeData(
      data.filter(d => d.socio_economic_status === 'Below poverty line').map(d => d.nat_results),
      ranges
    );
    const onPovertyLineData = bucketizeData(
      data.filter(d => d.socio_economic_status === 'On poverty line').map(d => d.nat_results),
      ranges
    );
    const abovePovertyLineData = bucketizeData(
      data.filter(d => d.socio_economic_status === 'Above poverty line').map(d => d.nat_results),
      ranges
    );

    // Set up chart data with gradient fills
    const ctx = chartRef.current.getContext('2d');
    const gradientBelow = ctx.createLinearGradient(0, 0, 0, 400);
    gradientBelow.addColorStop(0, '#1F4A5E'); // Darker teal
    gradientBelow.addColorStop(1, '#1ABC9C'); // Lighter teal

    const gradientOn = ctx.createLinearGradient(0, 0, 0, 400);
    gradientOn.addColorStop(0, '#2C3E50'); // Darker blue-grey
    gradientOn.addColorStop(1, '#33C1FF'); // Lighter blue

    const gradientAbove = ctx.createLinearGradient(0, 0, 0, 400);
    gradientAbove.addColorStop(0, '#16A085'); // Darker greenish teal
    gradientAbove.addColorStop(1, '#70FF83'); // Lighter green

    const chartData = {
      labels,
      datasets: [
        {
          label: 'Below Poverty Line',
          data: belowPovertyLineData,
          backgroundColor: gradientBelow,
          borderColor: '#1F4A5E',
          borderWidth: 1,
          hoverBackgroundColor: '#1ABC9C',
        },
        {
          label: 'On Poverty Line',
          data: onPovertyLineData,
          backgroundColor: gradientOn,
          borderColor: '#2C3E50',
          borderWidth: 1,
          hoverBackgroundColor: '#33C1FF',
        },
        {
          label: 'Above Poverty Line',
          data: abovePovertyLineData,
          backgroundColor: gradientAbove,
          borderColor: '#16A085',
          borderWidth: 1,
          hoverBackgroundColor: '#70FF83',
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1500,
        easing: 'easeOutBounce',
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 14,
              family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            },
            color: '#4A4A4A',
            padding: 10,
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'NAT Score Ranges',
            font: {
              size: 14,
              weight: 'bold',
            },
            color: '#666',
          },
          grid: {
            display: false,
          },
        },
        y: {
          title: {
            display: true,
            text: 'Frequency',
            font: {
              size: 14,
              weight: 'bold',
            },
            color: '#666',
          },
          beginAtZero: true,
          grid: {
            color: 'rgba(200, 200, 200, 0.2)',
          },
        },
      },
    };

    // Cleanup previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create a new chart instance
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: chartOptions,
    });

    // Cleanup on component unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default BarChartComponent;
