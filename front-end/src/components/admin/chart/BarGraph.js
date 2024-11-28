import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const BarGraph = ({ labels, datas }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
        display: false,
      },
      title: {
        display: false,
        text: "Chart.js Bar Chart",
      },
    },
  };

  const data = {
    labels: labels
      ? labels
      : ["Red", "Blue", "Yellow", "Green", "Purple", "Orange", "Green"],
    datasets: [
      {
        label: "Lượt mua",
        data: datas ? datas : [12, 19, 3, 5, 2, 3, 5],
        backgroundColor: [
          "rgba(245, 7, 7, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
          "rgba(7, 219, 7, 0.8)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(7, 219, 7, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  return <Bar options={options} data={data} />;
};
