import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { memo } from 'react';
import { FC } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const options: ChartOptions<'line'> = {
  responsive: true,
  scales: {
    y: {
      type: 'linear',
      beginAtZero: false,
    },
    x: {
      type: 'linear',
      beginAtZero: false,
    },
  },
  plugins: {
    legend: {
      display: true,
      fullSize: false,
    },
    title: {
      display: false,
      position: 'bottom',
    },
  },
};
interface FftGraph {
  x: number;
  y: number;
}
interface Props {
  name: string;
  color: "red" | "green",
  label: "Raw Data" | "FFT"
  data: FftGraph[];
}

// eslint-disable-next-line react-refresh/only-export-components
const RealTimeChart: FC<Props> = ({ name, data , color , label }) => {
  const chartData = {
    // labels: label,
    datasets: [
      {
        label: label,
        data: data,
        borderColor: color,
      },
    ],
  };

  return (
    <div>
      <Line id={name+label} width={'100%'} height={'80%'} options={options} data={chartData} />
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default memo(RealTimeChart);
