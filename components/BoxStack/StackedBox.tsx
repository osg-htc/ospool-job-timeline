import {Box} from "@mui/material";

interface StackedBoxProps {
  color: string;
  scalingFactor?: number;
  transform: "bottom" | "top" | "left" | "right";
}

const axisMap: Record<StackedBoxProps["transform"], { scale: "scaleX" | "scaleY" }> = {
  bottom: { scale: "scaleY" },
  top:    { scale: "scaleY" },
  left:   { scale: "scaleX" },
  right:  { scale: "scaleX" },
};

const StackedBox = ({color, scalingFactor, transform}: StackedBoxProps) => {
  const { scale } = axisMap[transform];
  const animationName = `expandFrom${transform.charAt(0).toUpperCase() + transform.slice(1)}`;

  return (
    <Box
      sx={{
        borderRadius: '1px',
        height: scalingFactor,
        width: scalingFactor,
        backgroundColor: color,
        transformOrigin: transform,
        animation: `${animationName} 0.2s ease-out`,
        [`@keyframes ${animationName}`]: {
          from: { transform: `${scale}(0)`, opacity: 0 },
          to:   { transform: `${scale}(1)`, opacity: 1 },
        },
      }}
    >
      &nbsp;
    </Box>
  )
}

export default StackedBox;

