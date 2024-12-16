import { Line } from "react-chartjs-2";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const LineGraph = ({ labels, datas, showLegend = false }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        display: showLegend,
      },
      title: {
        display: false,
        text: "Chart.js Line Chart",
      },
    },
  };

  const data = {
    labels: labels
      ? labels
      : ["January", "February", "March", "April", "May", "June", "July"],
    datasets: datas,
    // [
    //   // {
    //   //   label: "Doanh thu",
    //   //   backgroundColor: "rgb(2, 41, 184)",
    //   //   borderColor: "rgb(2, 41, 184)",
    //   //   data: datas ? datas : [0, 10, 5, 2, 20, 30, 45],
    //   // },
    //   // {
    //   //   label: "Goi 2",
    //   //   backgroundColor: "rgb(99, 107, 255)",
    //   //   borderColor: "rgb(99, 107, 255)",
    //   //   data: [10, 2, 20, 10, 5, 45, 30],
    //   // },
    // ],
  };

  return <Line options={options} data={data} />;
};
