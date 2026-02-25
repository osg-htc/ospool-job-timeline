"use client";

import ExecutionPointMarkers from "@/components/ExecutionPointMarkers";
import {JobResource} from "@/app/types";
import {useEffect, useState, useMemo} from "react";
import DateTimePlayer from "@/components/DateTimePlayer";

interface OSPoolJobTimelineProps {
  startTime: number;
  endTime: number;
  jobResources: Record<string, JobResource>;
  timeSegments?: number;
}

const OSPoolJobTimeline = ({startTime, endTime, jobResources, timeSegments = 100}: OSPoolJobTimelineProps) => {

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
    }, 1000);

    return () => window.clearInterval(id);
  }, [timeArray]);

  const time = timeArray[Math.min(timeIndex, timeArray.length - 1)] ?? startTime;

  return (
    <>
      <ExecutionPointMarkers time={time} jobResources={jobResources} />
      <DateTimePlayer time={time} />
    </>
  );
}

export default OSPoolJobTimeline;
