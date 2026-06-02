import React from 'react';
import Plot from 'react-plotly.js';

const ViolinPlotSex = ({ data }) => {
  // Prepare data for Violin Plot (NAT Results by Sex)
  const maleNatResults = data.filter(d => d.sex === 'Male').map(d => d.nat_results);
  const femaleNatResults = data.filter(d => d.sex === 'Female').map(d => d.nat_results);

  const plotData = [
    {
      type: 'violin',
      y: maleNatResults,
      box: { visible: true },
      line: { color: '#1f6690' }, // Darker blue
      meanline: { visible: true },
      name: 'Male',
      marker: { color: '#1f6690' }, // Darker blue
      bandwidth: 0.5,
    },
    {
      type: 'violin',
      y: femaleNatResults,
      box: { visible: true },
      line: { color: '#c0392b' }, // Darker red
      meanline: { visible: true },
      name: 'Female',
      marker: { color: '#c0392b' }, // Darker red
      bandwidth: 0.5,
    },
  ];

  const layout = {
    title: 'Distribution of NAT Results by Sex',
    yaxis: {
      title: 'NAT Results',
    },
    xaxis: {
      title: 'Sex',
      tickvals: [0, 1],
      ticktext: ['Male', 'Female'],
    },
    violingap: 0.3, // Adjust spacing between the violins
    showlegend: false, // To hide the legend
  };

  return (
    <div style={{ width: '700px', height: '400px' }}>
      <Plot
        data={plotData}
        layout={layout}
      />
    </div>
  );
};

export default ViolinPlotSex;
