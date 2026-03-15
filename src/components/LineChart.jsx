// components/LineChart.jsx
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const LineChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [
            {
              label: 'Revenue',
              data: [65000, 59000, 80000, 81000, 86000, 85000, 90000],
              borderColor: '#0A5C60',
              backgroundColor: 'rgba(10, 92, 96, 0.1)',
              fill: true,
              tension: 0.4,
              borderWidth: 2,
              pointRadius: 3,
              pointHoverRadius: 5
            },
            {
              label: 'Orders',
              data: [28000, 30000, 40000, 45000, 38000, 42000, 48000],
              borderColor: '#9FE2BF',
              backgroundColor: 'rgba(159, 226, 191, 0.1)',
              fill: true,
              tension: 0.4,
              borderWidth: 2,
              pointRadius: 3,
              pointHoverRadius: 5
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                usePointStyle: true,
                padding: 15,
                color: '#4B5568',
                font: {
                  size: 11
                }
              }
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              titleFont: { size: 11 },
              bodyFont: { size: 10 },
              padding: 8
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                drawBorder: false,
                color: 'rgba(10, 92, 96, 0.05)'
              },
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                },
                font: { size: 9 },
                color: '#94A3B8'
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                font: { size: 9 },
                color: '#94A3B8'
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return <canvas ref={chartRef} />;
};

export default LineChart;