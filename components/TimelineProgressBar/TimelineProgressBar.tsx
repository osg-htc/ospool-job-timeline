import {Box, LinearProgress} from "@mui/material";

interface TimelineProgressBarProps {
  progress: number; // Progress value between 0 and 1
}

const TimelineProgressBar = ({ progress }: TimelineProgressBarProps) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        margin: 1,
        width: 'calc(100% - 16px)',
        height: '10%',
      }}
    >
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  )
}

export default TimelineProgressBar;
