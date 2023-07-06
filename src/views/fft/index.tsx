
import { useEffect, useState } from "react"
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Chip } from '@mui/material';
import RealtimeChart from './RealTimeChart';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import StopIcon from '@mui/icons-material/Stop';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {
  Link
 } from "react-router-dom";


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: "100%",
}));

export interface SendingData {
  x: number,
  y: number,
  z: number,
  time: string,
  name: string
}

export interface NewRealTImeData {
  [key: string]: {
    x: number[],
    y: number[],
    z: number[],
    label: string[]

  }
}
export type NewLabel = string[]

// type RealTimeDataOneKey = {
//   [key: string]: SendingData;
// };

const MAX_DATA_POINTS = 50;

const Stats = () => {
  // const [realTimeDataOneKey, setRealTimDataOneKey] = useState<RealTimeDataOneKey>({})
  const [newRealTImeData, setNewRealTimeData] = useState<NewRealTImeData>({})
  const [url, setUrl] = useState('http://localhost:3001/sse');
  const [sse, setSse] = useState<EventSource | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const startSSE = () => {
    const newSse = new EventSource(url, { withCredentials: true });
    newSse.onmessage = (e) => updateNewState(JSON.parse(e.data));
    newSse.onerror = () => {
      newSse.close();
    };
    setSse(newSse);
  };

  const closeSSE = () => {
    if (sse) {
      sse.close();
      setSse(null);
    }
  };

  useEffect(() => {
    return () => {
      closeSSE();
    };
  }, []);



  const updateNewState = (data: SendingData[]) => {
    setNewRealTimeData((prevRealTimeData) => {
      const updatedRealTimeData = { ...prevRealTimeData };

      for (const dataItem of data) {
        const { name, x, y, z, time } = dataItem;

        if (updatedRealTimeData[name]) {
         // If the name already exists in newRealTimeData, update the data and time
         updatedRealTimeData[name] = {
          x: [...updatedRealTimeData[name].x , x],
          y:[...updatedRealTimeData[name].y , y],
          z: [...updatedRealTimeData[name].z , z],
          label: [...updatedRealTimeData[name].label , time]
        }
 
         if (updatedRealTimeData[name].x.length > MAX_DATA_POINTS) {
          updatedRealTimeData[name] = {
            x:[...updatedRealTimeData[name].x].slice(1),
            y: [...updatedRealTimeData[name].y].slice(1),
            z: [ ...updatedRealTimeData[name].z].slice(1),
            label: [ ...updatedRealTimeData[name].label].slice(1)
          }
         }
        } else {
          // If the name doesn't exist, create a new entry in newRealTimeData
          updatedRealTimeData[name] = {
            x: [x],
            y: [y],
            z: [z],
            label: [time]
          }
        }
      }

      return updatedRealTimeData;
    })



  }




  const handleClickStartCloseConnection = () => {
    if (sse) {
      closeSSE()
    } else {
      startSSE()
    }
  }

  return (
    <div>

      <Box sx={{ flexGrow: 1, marginBottom: '1rem' }}>
        <AppBar color="transparent" position="static" elevation={1}>
          <Toolbar variant="dense">
            <IconButton     id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick} edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Grid container sx={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }} spacing={2} alignItems={"center"}>
              <Grid item xs={3} display={"flex"} alignItems={"center"}>
                <OutlinedInput color="info" disabled={Boolean(sse)} defaultValue={url} onChange={(e) => setUrl(e.target.value)}
                  id="outlined-basic" size='small'
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickStartCloseConnection}
                        edge="end"
                      >
                        {!sse ? <PlayCircleOutlineIcon color="success" /> : <StopIcon color="warning" />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </Grid>
              <Grid item xs={9} display={"flex"} alignItems={"center"} justifyContent={"space-evenly"}>
                <Chip label="Current time RTC : Nan" variant="outlined" />
                <Chip label="Current time PC : Nan" variant="outlined" />
                <Chip label="odr : Nan" variant="outlined" />
                <Chip label="Battery : Nan" variant="outlined" />
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </Box>




      <Grid container spacing={2} style={{ padding: '1rem' }} alignItems={"center"}>
        {Object.keys(newRealTImeData).map((key) => <Grid key={key} item xs={6}>
          <Item> <RealtimeChart name={key} label={newRealTImeData[key].label} data={newRealTImeData[key]} /></Item>
        </Grid>)}

      </Grid>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>
        <Link to={`/sst`}>          STATS
</Link>

        </MenuItem>
      </Menu>


    </div>
  )
}

export default Stats