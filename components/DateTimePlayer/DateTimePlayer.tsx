import {Box, IconButton} from "@mui/material";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ReplayIcon from "@mui/icons-material/Replay";

interface TimePlayerProps {
  time: number;
  isPaused: boolean;
  speed?: number;
  setSpeed?: (speed: number) => void;
  onPause: () => void;
  onReset: () => void;
}

const SPEEDS = [1, 10, 100];

const DateTimePlayer = ({time, isPaused, speed = 1, setSpeed, onPause, onReset}: TimePlayerProps) => {
  const handleSpeedClick = () => {
    if (!setSpeed) return;
    const currentIndex = SPEEDS.indexOf(speed);
    const nextIndex = (currentIndex + 1) % SPEEDS.length;
    setSpeed(SPEEDS[nextIndex]);
  };

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
      <Box
        onClick={handleSpeedClick}
        sx={{
          fontWeight: 700,
          cursor: setSpeed ? 'pointer' : 'default',
          border: '1px solid white',
          borderRadius: 1,
          px: 1,
          py: 0.25,
          fontSize: '0.75rem',
          userSelect: 'none',
          minWidth: 40,
          textAlign: 'center',
        }}
      >
        {speed}x
      </Box>
      <Box sx={{fontWeight: 700}}>Current Time: {new Date(time * 1000).toLocaleDateString()}</Box>
    </Box>
  )
}

export default DateTimePlayer;
