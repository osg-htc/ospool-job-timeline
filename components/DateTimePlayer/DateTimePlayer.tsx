import {Box} from "@mui/material";

interface TimePlayerProps {
  time: number;
}

const DateTimePlayer = ({time}: TimePlayerProps) => {

  console.log(time)

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        bgcolor: 'background.paper',
        p: 1,
        borderRadius: 1,
        zIndex: 9999,
      }}
    >
      <p>Current Time: {new Date(time * 1000).toLocaleDateString()}</p>
    </Box>
  )
}

export default DateTimePlayer;
