import {stringToColor} from "@/util/stringToColor";
import StackedBox from "@/components/BoxStack/StackedBox";

interface BoxStackProps {
  count?: number;
  boxes?: string[];
  transform?: "bottom" | "top" | "left" | "right";
}

const SCALING_FACTOR = 8;

const BoxStack = ({count, boxes, transform} : BoxStackProps) => {

  if(!count && !boxes) return null;

  const boxArray = boxes ? boxes : Array(count).fill('');
  const boxColors = boxArray.map((x) => stringToColor(x));

  return (
    <>
      {boxColors.map((color, index) => (
        <StackedBox
          key={boxArray[index]}
          color={color}
          scalingFactor={SCALING_FACTOR}
          transform={transform || "bottom"}
        />
      ))}
    </>
  )
}

export default BoxStack;