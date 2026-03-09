"use client";

import { useEffect, useRef, useMemo } from "react";
import { stringToColor } from "@/util/stringToColor";
import { JobRecord } from "../../page";

interface BoxStackProps {
  jobs: JobRecord[];
  displayFunction?: (job: JobRecord) => boolean;
  transform?: "bottom" | "top" | "left" | "right";
  size?: number;
  mute?: boolean;
  fixedCols?: number;
  fixedRows?: number;
}

const BOX_SIZE = 4;
const GAP = 1;

const BoxStack = ({ jobs, displayFunction, transform = "bottom", size, mute = false, fixedCols, fixedRows }: BoxStackProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxSize = size ?? BOX_SIZE;

  const visibleJobs = useMemo(
    () => (displayFunction ? jobs.filter(displayFunction) : jobs),
    [jobs, displayFunction]
  );

  // Canvas dimensions
  const cols = fixedCols ?? (fixedRows ? Math.ceil(visibleJobs.length / fixedRows) : Math.ceil(Math.sqrt(visibleJobs.length)) || 1);
  const rows = fixedRows ?? Math.ceil(visibleJobs.length / cols);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = cols * (boxSize + GAP);
    canvas.height = rows * (boxSize + GAP);

    visibleJobs.forEach((job, i) => {
      const color = mute
        ? stringToColor(job.GlobalJobId, 20, 40)
        : stringToColor(job.GlobalJobId);

      let col: number, row: number;
      col = i % cols;
      row = Math.floor(i / cols);

      const x = (cols - 1 - col) * (boxSize + GAP);
      const y = (rows - 1 - row) * (boxSize + GAP);

      ctx.fillStyle = color;
      ctx.fillRect(x, y, boxSize, boxSize);
    });
  }, [visibleJobs, boxSize, mute, cols, rows]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", background: "transparent" }}
    />
  );
};

export default BoxStack;
