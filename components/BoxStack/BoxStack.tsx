import {stringToColor} from "@/util/stringToColor";
import {Box} from "@mui/material";

interface BoxStackProps {
  count?: number;
  boxes?: string[];
}

const SCALING_FACTOR = 8;

const BoxStack = ({count, boxes} : BoxStackProps) => {

  if(!count && !boxes) return null;

  const boxArray = boxes ? boxes : Array(count).fill('');
  const boxColors = boxArray.map((x) => stringToColor(x));

  return (
    <>
      {boxColors.map((color, index) => (
        <Box key={boxArray[index]} sx={{borderRadius: '1px', height: SCALING_FACTOR, width: SCALING_FACTOR, backgroundColor: color}}>&nbsp;</Box>
      ))}
    </>
  )
}

export default BoxStack;