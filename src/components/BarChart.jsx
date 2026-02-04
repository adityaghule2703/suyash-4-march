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
                'rgba(59, 130, 246, 0.7)',
                'rgba(14, 165, 233, 0.7)',
                'rgba(56, 189, 248, 0.7)',
                'rgba(125, 211, 252, 0.7)',
                'rgba(186, 230, 253, 0.7)'
              ],
              borderColor: [
                '#3b82f6',
                '#0ea5e9',
                '#38bdf8',
                '#7dd3fc',
                '#bae6fd'
              ],
              borderWidth: 1,
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                drawBorder: false
              },
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            },
            x: {
              grid: {
                display: false
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