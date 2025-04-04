import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Chart = ({ chartData, chartType = 'bar' }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Interaction Data',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        },
        padding: 10,
        cornerRadius: 6,
        displayColors: true
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  };

  // Prepare data for pie/doughnut charts
  const preparePieData = () => {
    return {
      labels: chartData.labels,
      datasets: [
        {
          label: 'Interactions',
          data: chartData.datasets[0].data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(199, 199, 199, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(199, 199, 199, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const renderChart = () => {
    switch(chartType) {
      case 'line':
        return <Line options={options} data={chartData} />;
      case 'pie':
        return <Pie options={options} data={preparePieData()} />;
      case 'doughnut':
        return <Doughnut options={options} data={preparePieData()} />;
      case 'bar':
      default:
        return <Bar options={options} data={chartData} />;
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-5px)'
        }
      }}
    >
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ 
          fontWeight: 'bold',
          color: 'primary.main'
        }}
      >
        Interaction Frequency ({chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart)
      </Typography>
      <Box 
        sx={{ 
          height: '50vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {renderChart()}
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
        This chart shows the number of interactions with the Medical AI Assistant over the past week.
      </Typography>
    </Paper>
  );
};

export default Chart;