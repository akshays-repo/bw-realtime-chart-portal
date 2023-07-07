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
import { MAX_DATA_POINTS } from '../../constants';
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
  x: number;
  y: number;
  z: number;
  time: string;
  name: string;
}

export interface RealTimeGraph {
  [key: string]: {
    x: number[];
    y: number[];
    z: number[];
    label: string[];
  };
}
export type Labels = string[];

// TODO: CODE CLEAN UP IS NOT COMPLETED

const Stats = () => {
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

  const handleUpdateRealTimeChartData = (data: SseResponse[]): void => {
    setRealTimeGraph((prevRealTimeData) => {
      const updatedRealTimeData = { ...prevRealTimeData };

      for (const dataItem of data) {
        const { name, x, y, z, time } = dataItem;

        if (updatedRealTimeData[name]) {
          // If the name already exists in newRealTimeData, update the data and time
          // TODO: Need to refactor with out spread operator since its take large memory
          updatedRealTimeData[name] = {
            x: [...updatedRealTimeData[name].x, x],
            y: [...updatedRealTimeData[name].y, y],
            z: [...updatedRealTimeData[name].z, z],
            label: [...updatedRealTimeData[name].label, time],
          };

          if (updatedRealTimeData[name].x.length > MAX_DATA_POINTS) {
            updatedRealTimeData[name] = {
              x: [...updatedRealTimeData[name].x].slice(1),
              y: [...updatedRealTimeData[name].y].slice(1),
              z: [...updatedRealTimeData[name].z].slice(1),
              label: [...updatedRealTimeData[name].label].slice(1),
            };
          }
        } else {
          // If the name doesn't exist, create a new entry in newRealTimeData
          updatedRealTimeData[name] = {
            x: [x],
            y: [y],
            z: [z],
            label: [time],
          };
        }
      }

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
      handleCloseMetaSSE()
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
    navigate('/fft');
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
                <Chip size='small' color='info' label={`TIME PC : ${metaData?.time_pc || 'Nill'}`} variant="outlined" />
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
              <RealtimeChart name={key} label={realTimeGraph[key].label} data={realTimeGraph[key]} />
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
        <MenuItem onClick={handleClickMenuOption}>FFT</MenuItem>
      </Menu>
    </div>
  );
};

export default Stats;
