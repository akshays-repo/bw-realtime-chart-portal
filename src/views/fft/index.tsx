import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Chip } from '@mui/material';
import RealtimeChart from './RealTimeChart';
import IconButton from '@mui/material/IconButton';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { toast } from 'react-toastify';
import { useUrlStore } from './useUrlStore';
import { useNavigate } from 'react-router-dom';
import RouterInputBox from '../../components/RouterInput';
import useMetaDataSEE from '../../hooks/useMetaDataSEE';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '100%',
}));

export interface SseResponse {
  raw_data_x: number[];
  raw_data_y: number[];
  fft_x: number[];
  fft_y: number[];
  name: string;
}

interface FftGraph {
  x: number;
  y: number;
}
export interface RealTimeGraph {
  [key: string]: {
    rawData: FftGraph[];
    fft: FftGraph[];
  };
}
export type Labels = number[];

// TODO: CODE CLEAN UP IS NOT COMPLETED

const Fft = () => {
  const navigate = useNavigate();
  const { url, newUrl, setUrl, setNewUrl } = useUrlStore((state) => state);
  const [realTimeGraph, setRealTimeGraph] = useState<RealTimeGraph>({});
  const [sse, setSse] = useState<EventSource | null>(null);
  const [anchorElMenu, setAnchorElMenu] = useState<null | HTMLElement>(null);
  const { metaData, handleCloseMetaSSE, handleStartMetaSSE } = useMetaDataSEE({ url, newUrl });
  const openMenu = Boolean(anchorElMenu);

  useEffect(() => {
    return () => {
      handleCloseSSE();
    };
  }, []);

  const handleUpdateRealTimeChartData = (data: SseResponse): void => {
    setRealTimeGraph((prevRealTimeData) => {
      const updatedRealTimeData = { ...prevRealTimeData };
      const { name, fft_x, raw_data_x, fft_y, raw_data_y } = data;

      const rowData: FftGraph[] = [];
      const fft: FftGraph[] = [];

      for (let fftIndex = 0; fftIndex < fft_x.length; fftIndex++) {
        fft.push({
          x: fft_x[fftIndex],
          y: fft_y[fftIndex],
        });
      }

      for (let rowDataIndex = 0; rowDataIndex < raw_data_x.length; rowDataIndex++) {
        rowData.push({
          x: raw_data_x[rowDataIndex],
          y: raw_data_y[rowDataIndex],
        });
      }
      updatedRealTimeData[name] = {
        rawData: rowData,
        fft: fft,
      };
      return updatedRealTimeData;
    });
  };

  const handleStartSSE = () => {
    if (url !== newUrl) {
      setUrl(newUrl);
      setRealTimeGraph({});
    }
    try {
      const newSse = new EventSource(newUrl, { withCredentials: true });
      newSse.onmessage = (e) => handleUpdateRealTimeChartData(JSON.parse(e.data));
      newSse.onerror = () => {
        toast.error('Failed to connect');
        newSse.close();
      };
      setSse(newSse);
    } catch (error) {
      toast.error('Failed to connect');
    }
  };

  const handleCloseSSE = () => {
    if (sse) {
      sse.close();
      setSse(null);
    }
  };

  const handleClickStartCloseConnection = () => {
    if (sse) {
      handleCloseSSE();
      handleCloseMetaSSE();
    } else {
      handleStartSSE();
      handleStartMetaSSE()
    }
  };

  const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElMenu(null);
  };

  const handleClickMenuOption = () => {
    navigate('/sst');
  };

  
  return (
    <div>
      <Box sx={{ flexGrow: 1, marginBottom: '1rem' }}>
        {/* TODO:Extract App bar in to separate component */}
        <AppBar color="transparent" position="static" elevation={1}>
          <Toolbar variant="dense">
            <IconButton
              id="basic-button"
              aria-controls={openMenu ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openMenu ? 'true' : undefined}
              onClick={handleClickMenu}
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Grid container sx={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }} spacing={2} alignItems={'center'}>
              <Grid item xs={3} display={'flex'} alignItems={'center'}>
                <RouterInputBox
                  color={'info'}
                  url={url}
                  onChangeUrl={(e) => setNewUrl(e)}
                  onClickStartCloseConnection={() => {
                    handleClickStartCloseConnection();
                  }}
                  sse={Boolean(sse)}
                />
              </Grid>
              <Grid item xs={9} display={'flex'} alignItems={'center'} justifyContent={'space-evenly'}>
                <Chip color='info' label={`TIME RTC : ${metaData?.time_rtc || 'Nill'}`} variant="outlined" />
                <Chip color='info' label={`TIME PC : ${metaData?.time_pc || 'Nill'}`} variant="outlined" />
                <Chip color='info' label={`Battery : ${metaData?.battery || 'Nill'}`} variant="outlined" />
                <Chip color='info' label={`ODR : ${metaData?.odr || 'Nill'}`} variant="outlined" />
                <Chip color='info' label={`PC - RTC : ${metaData?.diff || 'Nill'}`} variant="outlined" />
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </Box>

      {sse === null && !realTimeGraph && (
        <Grid item display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <div> Please set up the router and click "Start"</div>
        </Grid>
      )}

      <Grid container spacing={2} style={{ padding: '1rem' }} alignItems={'center'}>
        {Object.keys(realTimeGraph).map((key) => (
          <Grid key={key} item xs={6}>
            <Item>
              <RealtimeChart name={key} data={realTimeGraph[key]} />
            </Item>
          </Grid>
        ))}
      </Grid>

      <Menu
        id="basic-menu"
        anchorEl={anchorElMenu}
        open={openMenu}
        onClose={handleCloseMenu}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClickMenuOption}>SST</MenuItem>
      </Menu>
    </div>
  );
};

export default Fft;
