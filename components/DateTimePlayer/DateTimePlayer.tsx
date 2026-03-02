import {Box, IconButton} from "@mui/material";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ReplayIcon from "@mui/icons-material/Replay";

interface TimePlayerProps {
  time: number;
  isPaused: boolean;
  onPause: () => void;
  onReset: () => void;
}

const DateTimePlayer = ({time, isPaused, onPause, onReset}: TimePlayerProps) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 48,
        left: '50%',
        transform: 'translate(-50%, -50%)',
        p: 1,
        borderRadius: 1,
        zIndex: 9999,
        backgroundColor: 'black',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <IconButton size="small" onClick={onPause} sx={{color: 'white'}}>
        {isPaused ? <PlayArrowIcon fontSize="small" /> : <PauseIcon fontSize="small" />}
      </IconButton>
      <IconButton size="small" onClick={onReset} sx={{color: 'white'}}>
        <ReplayIcon fontSize="small" />
      </IconButton>
      <Box sx={{fontWeight: 700}}>Current Time: {new Date(time * 1000).toLocaleDateString()}</Box>
    </Box>
  )
}

export default DateTimePlayer;
