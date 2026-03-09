"use client";

import ExecutionPointMarkers from "../ExecutionPointMarkers";
import {JobRecord, JobResource} from "../../page";
import {useEffect, useState, useMemo} from "react";
import DateTimePlayer from "../DateTimePlayer";
import {Box, Typography} from "@mui/material";
import BoxStack from "../BoxStack/BoxStack";
import {stringToColor} from "@/util/stringToColor";
import TimelineProgressBar from "../TimelineProgressBar";

interface OSPoolJobTimelineProps {
  startTime: number;
  endTime: number;
  jobResources: Record<string, JobResource>;
  timeSegments?: number;
}

const OSPoolJobTimeline = ({startTime, endTime, jobResources, timeSegments = 1000}: OSPoolJobTimelineProps) => {

  // number of points to generate (at least 2 so we include start and end)
  const segments = Math.max(2, Math.floor(timeSegments));

  // build a uniformly distributed array of length `segments`, inclusive of startTime and endTime
  const timeArray = useMemo(() => {
    const start = Number(startTime);
    const end = Number(endTime);
    if (!isFinite(start) || !isFinite(end)) return [start];

    const pts: number[] = [];
    const step = (end - start) / (segments - 1);
    for (let i = 0; i < segments; i++) {
      // keep integer milliseconds if inputs are integers
      pts.push(Math.round(start + step * i));
    }
    // ensure last point exactly matches endTime
    pts[pts.length - 1] = end;
    return pts;
  }, [startTime, endTime, segments]);

  // index into the timeArray
  const [timeIndex, setTimeIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(1);

  const handlePause = () => setIsPaused(p => !p);
  const handleReset = () => { setTimeIndex(0); setIsPaused(true); };

  // advance one step per second; reset when the source array changes
  useEffect(() => {
    if (isPaused) return;

    let rafId: number;
    let lastTimestamp: number | null = null;
    const msPerStep = 100 / speed;

    const tick = (timestamp: number) => {
      if (lastTimestamp === null) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;
      const steps = Math.floor(elapsed / msPerStep);

      if (steps > 0) {
        lastTimestamp = timestamp - (elapsed % msPerStep);
        setTimeIndex((prev) => {
          if (prev >= timeArray.length - 1) return prev;
          return Math.min(prev + steps, timeArray.length - 1);
        });
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [timeArray, isPaused, speed]);

  const time = timeArray[Math.min(timeIndex, timeArray.length - 1)] ?? startTime;

  const maxJobsPerResource = useMemo(
    () => Math.max(...Object.values(jobResources).map(r => r.jobs.length), 1),
    [jobResources]
  );
  const markerHeight = 2;
  const maxBarHeight = 300; // px, ~1/3 of a typical viewport
  const jobsPerRect = Math.ceil(maxJobsPerResource / (maxBarHeight / markerHeight));

  return (
    <>
      <TimelineProgressBar progress={( 1 - ((time - endTime) / (startTime - endTime))) * 100} />
      <Box
        sx={{
          position: 'absolute',
          bottom: 48,
          right: 16,
          zIndex: 1000,
          width: '15%',
          bgcolor: 'rgba(255, 255, 255, 0.0)',
          p: 2,
          borderRadius: 1
        }}
      >
        <Box display="flex" flexDirection="row" height={"100%"} flexWrap={'wrap'} sx={{flexFlow: 'wrap-reverse', justifyContent: 'end'}} gap={.2}>
          <BoxStack
            transform={"right"}
            jobs={Object.values(jobResources).flatMap(r => r.jobs).sort((a, b) => a.CompletionDate - b.CompletionDate)}
            displayFunction={j => j.CompletionDate < time}
            fixedCols={60}
          />
        </Box>
        <Typography mt={1} textAlign={"right"} variant="subtitle2" component="div">Epochs Completed: {Object.values(jobResources).flatMap(r => r.jobs).filter((a) => a.CompletionDate <= time).length}</Typography>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          zIndex: 999999,
          display: 'flex',
          flexDirection: 'row',
          gap: 4,
          borderRadius: 1,
          width: '100vw',
          justifyContent: 'space-between',
        }}
      >
        <Box display={"flex"} width={"100%"} justifyContent={"space-between"} p={2}>
          <Box>
            <Typography variant="body2" sx={{fontWeight: 600}}>{new Date(startTime * 1000).toLocaleDateString()}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{fontWeight: 600}}>{new Date(endTime * 1000).toLocaleDateString()}</Typography>
          </Box>
        </Box>
      </Box>
      <ExecutionPointMarkers time={time} jobResources={jobResources} jobsPerRect={jobsPerRect} />
      <Box
        sx={{
          position: 'absolute',
          bottom: 64,
          left: 8,
          zIndex: 1000,
          bgcolor: 'rgba(255,255,255,0.85)',
          px: 1.5,
          py: 1,
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          boxShadow: 1,
        }}
      >
        <Box sx={{ width: 50, height: markerHeight * 5, bgcolor: stringToColor('cool string'), flexShrink: 0 }} />
        <Typography variant="caption">= {jobsPerRect.toLocaleString()} Epochs, top bar rounds up</Typography>
      </Box>
      <DateTimePlayer time={time} isPaused={isPaused} speed={speed} setSpeed={setSpeed} onPause={handlePause} onReset={handleReset} />
    </>
  );
}

export default OSPoolJobTimeline;
