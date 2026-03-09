import {Box, LinearProgress} from "@mui/material";

interface TimelineProgressBarProps {
  progress: number; // Progress value between 0 and 1
}

const TimelineProgressBar = ({ progress }: TimelineProgressBarProps) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        margin: 1,
        width: 'calc(100% - 16px)',
        height: 48
      }}
    >
      <LinearProgress sx={{height: 48, borderRadius: 2, overflow: 'hidden'}} variant="determinate" value={progress} />
    </Box>
  )
}

export default TimelineProgressBar;
