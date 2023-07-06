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
import { Labels } from '.';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const options: ChartOptions<'line'> = {
  responsive: true,
  animation: {
    easing: 'linear',
  },
  scales: {
    x: {
      display: true,
    },
    y: {
      display: true,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      position: 'bottom',
    },
  },
};

interface Props {
  name: string;
  data: { x: number[]; y: number[]; z: number[] };
  label: Labels;
}

// eslint-disable-next-line react-refresh/only-export-components
const RealTimeChart: FC<Props> = ({ name, data, label }) => {
  const chartData = {
    labels: label,
    datasets: [
      {
        label: 'X',
        data: data.x,
        fill: false,
        borderColor: 'red',
        borderWidth: 1,
      },
      {
        label: 'Y',
        data: data.y,
        fill: false,
        borderColor: 'green',
        borderWidth: 1,
      },
      {
        label: 'Z',
        data: data.z,
        fill: false,
        borderColor: 'blue',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      {name}
      <Line id={name} width={'100%'} height={'48%'} options={options} data={chartData} />
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default memo(RealTimeChart);
