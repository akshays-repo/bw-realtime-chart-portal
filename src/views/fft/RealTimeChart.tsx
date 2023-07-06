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
import {  memo } from 'react';
import { FC } from 'react';
import { Line } from 'react-chartjs-2';
import { NewLabel, } from '.';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);



const options: ChartOptions<"line"> = {
  responsive: true,
  animation: {
    easing: 'linear'
  },
  scales: {
    x: {
      display: true
    },
    y: {
      display: true
    }
  },
    plugins: {
    legend: {
      display: false
    },
    title: {
      display: true,
      position: 'bottom'
    },
  },
};


interface Props {
  name: string
  data: { x: number[]; y: number[]; z: number[]; }
  label: NewLabel

}



const RealTimeChart: FC<Props> = ({ name, data , label }) => {
  const chartData = {
    labels:label ,
    datasets: [
      {
        label: 'X',
        data: data.x,
        fill: false,
        borderColor: 'red',
        borderWidth: 1
      },
      {
        label: 'Y',
        data: data.y,
        fill: false,
        borderColor: 'green',
        borderWidth: 1
      }
    ],
  };


  
  return <div>{name} <Line  id={name} width={"100%"} height={"90%"} options={options} data={chartData} /></div>;
}






export default memo(RealTimeChart)
