"use client";

import ExecutionPointMarkers from "@/components/ExecutionPointMarkers";
import {JobResource} from "@/app/types";
import {useEffect, useState, useMemo} from "react";
import DateTimePlayer from "@/components/DateTimePlayer";
import {Box, Typography} from "@mui/material";
import BoxStack from "@/components/BoxStack/BoxStack";
import TimelineProgressBar from "@/components/TimelineProgressBar";

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

  // advance one step per second; reset when the source array changes
  useEffect(() => {
    setTimeIndex(0);
    const id = window.setInterval(() => {
      setTimeIndex((prev) => {
        if (prev >= timeArray.length - 1) {
          // reached the end, stop the interval
          window.clearInterval(id);
          return prev;
        }
        return prev + 1;
      });
    }, 10);

    return () => window.clearInterval(id);
  }, [timeArray]);

  const time = timeArray[Math.min(timeIndex, timeArray.length - 1)] ?? startTime;

  const jobsToRun = Object.values(jobResources).flatMap(r => r.jobs.filter(j => time < j.CompletionDate))
  const jobsRan = Object.values(jobResources).flatMap(r => r.jobs.filter(j => time >= j.CompletionDate))

  return (
    <>
      <TimelineProgressBar progress={(timeIndex / timeArray.length) * 100} />
      <Box
        sx={{
          position: 'absolute',
          bottom: 72,
          left: 16,
          zIndex: 1000,
          width: '240px',
          bgcolor: 'rgba(255, 255, 255, 0.5)',
          p: 2,
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <Box display="flex" flexDirection="row" height={"100%"} flexWrap={'wrap'} sx={{flexFlow: 'wrap-reverse'}} gap={.2}>
          <BoxStack boxes={jobsToRun.map(x => x.GlobalJobId)} />
        </Box>
        <Typography mt={1} variant="subtitle2" component="div">Jobs To Run</Typography>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: 72,
          right: 16,
          zIndex: 1000,
          width: '200px',
          bgcolor: 'rgba(255, 255, 255, 0.5)',
          p: 2,
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <Box display="flex" flexDirection="row" height={"100%"} flexWrap={'wrap'} sx={{flexFlow: 'wrap-reverse', justifyContent: 'end'}} gap={.2}>
          <BoxStack boxes={jobsRan.map(x => x.GlobalJobId)} />
        </Box>
        <Typography mt={1} textAlign={"right"} variant="subtitle2" component="div">Jobs Completed</Typography>
      </Box>
      <ExecutionPointMarkers time={time} jobResources={jobResources} />
      <DateTimePlayer time={time} />
    </>
  );
}

export default OSPoolJobTimeline;
