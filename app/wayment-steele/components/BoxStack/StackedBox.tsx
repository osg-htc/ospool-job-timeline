import {Box} from "@mui/material";
import {useEffect, useState} from "react";

interface StackedBoxProps {
  color: string;
  borderColor?: string;
  scalingFactor?: number;
  transform: "bottom" | "top" | "left" | "right";
  display?: boolean;
  size?: number;
  children?: React.ReactNode;
}

const axisMap: Record<StackedBoxProps["transform"], { scale: "scaleX" | "scaleY" }> = {
  bottom: { scale: "scaleY" },
  top:    { scale: "scaleY" },
  left:   { scale: "scaleX" },
  right:  { scale: "scaleX" },
};

const StackedBox = ({color, borderColor, scalingFactor, transform, display = true, size, children}: StackedBoxProps) => {
  const [mounted, setMounted] = useState(display);
  const [animatingOut, setAnimatingOut] = useState(false);

  const { scale } = axisMap[transform];
  const enterAnimationName = `expandFrom${transform.charAt(0).toUpperCase() + transform.slice(1)}`;
  const exitAnimationName = `collapseFrom${transform.charAt(0).toUpperCase() + transform.slice(1)}`;

  useEffect(() => {
    if (!display && mounted) {
      setAnimatingOut(true);
    } else if (display && !mounted) {
      setAnimatingOut(false);
      setMounted(true);
    }
  }, [display]);

  if (!mounted) return null;

  return (
    <Box
      onAnimationEnd={() => {
        if (animatingOut) {
          setMounted(false);
          setAnimatingOut(false);
        }
      }}
      sx={{
        borderRadius: '1px',
        height: size || scalingFactor,
        width: size || scalingFactor,
        borderWidth: '0px',
        borderStyle: 'solid',
        borderColor: borderColor,
        backgroundColor: color,
        transformOrigin: transform,
        animation: `${animatingOut ? exitAnimationName : enterAnimationName} .5s ease-out forwards`,
        [`@keyframes ${enterAnimationName}`]: {
          from: { transform: `${scale}(0)` },
          to:   { transform: `${scale}(1)` },
        },
        [`@keyframes ${exitAnimationName}`]: {
          from: { transform: `${scale}(1)` },
          to:   { transform: `${scale}(0)` },
        },
      }}
    >
      {children || <>&nbsp;</>}
    </Box>
  )
}

export default StackedBox;

