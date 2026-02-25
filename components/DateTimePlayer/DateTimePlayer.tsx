import {Box} from "@mui/material";

interface TimePlayerProps {
  time: number;
}

const DateTimePlayer = ({time}: TimePlayerProps) => {
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
      }}
    >
      <Box>Current Time: {new Date(time * 1000).toLocaleDateString()}</Box>
    </Box>
  )
}

export default DateTimePlayer;
