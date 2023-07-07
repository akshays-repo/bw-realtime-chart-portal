import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import moment from 'moment';
export interface MetaSseResponse {
  time_rtc: string;
  time_pc: string;
  odr: number;
  battery: number;
  diff: string | undefined;
}

interface Props {
  url: string;
  newUrl: string;
}

function getTimeDifference(time1: string, time2: string): string {
  const format = 'YYYY-MM-DD_HH-mm-ss';
  
  // Parse the time strings using Moment.js
  const date1 = moment(time1, format);
  const date2 = moment(time2, format);
  
  // Calculate the duration between the two dates
  const duration = moment.duration(date2.diff(date1));
  
  // Get the difference in hours, minutes, and seconds
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();
  return `${hours}-${minutes}-${seconds}`
  
}


const useMetaDataSEE = ({ newUrl, url }: Props) => {
  const [sse, setSse] = useState<EventSource | null>(null);
  const [metaData, setMetaData] = useState<MetaSseResponse | null>(null);

  useEffect(() => {
    return () => {
      handleCloseMetaSSE();
    };
  }, []);

  const handleStartMetaSSE = () => {
    if (url !== newUrl) {
      setMetaData(null);
    }
    try {
      const newSse = new EventSource(newUrl + '/meta', { withCredentials: true });
      newSse.onmessage = (e) => updateData(JSON.parse(e.data));
      newSse.onerror = () => {
        toast.error('Failed to connect meta data');
        newSse.close();
      };
      setSse(newSse);
    } catch (error) {
      toast.error('Failed to connect meta data');
    }
  };

  const updateData = (data: MetaSseResponse) => {
    setMetaData({
      time_rtc: data.time_rtc,
      time_pc: data.time_pc,
      odr: data.odr,
      battery: data.battery,
      diff: getTimeDifference(data.time_pc,data.time_rtc),
    });
  };

  const handleCloseMetaSSE = () => {
    if (sse) {
      sse.close();
      setSse(null);
    }
  };

  return { handleStartMetaSSE, handleCloseMetaSSE, metaData };
};

export default useMetaDataSEE;
