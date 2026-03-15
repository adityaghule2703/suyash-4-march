// components/BarChart.jsx
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BarChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
          datasets: [
            {
              label: 'Sales',
              data: [12000, 19000, 8000, 15000, 11000],
              backgroundColor: [
                'rgba(159, 226, 191, 0.7)',
                'rgba(10, 92, 96, 0.7)',
                'rgba(6, 59, 62, 0.7)',
                'rgba(18, 140, 126, 0.7)',
                'rgba(13, 105, 108, 0.7)'
              ],
              borderColor: [
                '#9FE2BF',
                '#0A5C60',
                '#063B3E',
                '#128C7E',
                '#0D696C'
              ],
              borderWidth: 1,
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
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

export default BarChart;