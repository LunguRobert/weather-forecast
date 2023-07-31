import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "./style/TemperatureChart.css";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Temperature Variation Throughout the Day',
    },
    legend: {
      position: "top",
    },
  },
  maintainAspectRatio: false,
};

const TemperatureChart = ({ data }) => {
  const labels = data.map((hourData) => hourData.time.split(" ")[1]);
  const temperatures = data.map((hourData) => hourData.temp_c);
  const chartData = {
    labels,
    datasets: [
      {
        label: "Temperature (°C)",
        data: temperatures,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <div className="line-chart">
      <Line options={options} data={chartData} />
    </div>
  );
};

export default TemperatureChart;
