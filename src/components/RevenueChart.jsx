import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const RevenueChart = ({ data }) => {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [1200, 1900, 1500, 2000, data.payments.revenue.monthlyRevenue, 0],
        borderColor: 'rgb(20, 184, 166)', // teal-500
        backgroundColor: 'rgba(20, 184, 166, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  return (
    <Line 
      data={chartData} 
      options={{
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }} 
    />
  );
};
export default RevenueChart;