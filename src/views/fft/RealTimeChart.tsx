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
  data: { rawData: FftGraph[]; fft: FftGraph[] };
}

// eslint-disable-next-line react-refresh/only-export-components
const RealTimeChart: FC<Props> = ({ name, data }) => {
  const chartData = {
    // labels: label,
    datasets: [
      {
        label: 'Raw Data',
        data: data.rawData,
        borderColor: 'red',
      },
      {
        label: 'FFT',
        data: data.fft,
        borderColor: 'blue',
      },
    ],
  };

  return (
    <div>
      {name}
      <Line id={name} width={'100%'} height={'80%'} options={options} data={chartData} />
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default memo(RealTimeChart);
