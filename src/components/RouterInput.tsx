import React, { ChangeEvent } from 'react';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import StopIcon from '@mui/icons-material/Stop';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

type RouterInputBoxProps = {
  color: 'info' | 'success' | 'warning';
  url: string;
  onChangeUrl: (newUrl: string) => void;
  onClickStartCloseConnection: () => void;
  sse: boolean;
};

const RouterInputBox: React.FC<RouterInputBoxProps> = ({
  color,
  url,
  onChangeUrl,
  onClickStartCloseConnection,
  sse,
}) => {

  const handleChangeUrl = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeUrl(e.target.value);
  };

  const handleClickStartCloseConnection = () => {
    onClickStartCloseConnection();
  };

  return (
    <OutlinedInput
      color={color}
      disabled={Boolean(sse)}
      defaultValue={url}
      onChange={handleChangeUrl}
      id="outlined-basic"
      size="small"
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
  );
};

export default RouterInputBox;
