// src/components/Chart/FinanceChart.jsx

import React from 'react';
import './FinanceChart.scss';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement
);

const FinanceChart = ({ data }) => {
  // Prepare the chart data dynamically
  const chartData = {
    labels: data.transactions.map((transaction) => transaction.date),
    datasets: [
      {
        label: 'Income',
        data: data.transactions.map((transaction) =>
          transaction.amount > 0 ? transaction.amount : 0
        ),
        borderColor: 'var(--secondary)',
        backgroundColor: 'rgba(226, 192, 68, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: data.transactions.map((transaction) =>
          transaction.amount < 0 ? Math.abs(transaction.amount) : 0
        ),
        borderColor: 'var(--main)',
        backgroundColor: 'rgba(46, 82, 102, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Financial Overview (Monthly)',
      },
    },
  };

  return (
    <div className='chart-container'>
      <h2>Finance Overview</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default FinanceChart;
