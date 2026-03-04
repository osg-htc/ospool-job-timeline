"use client";

import ExecutionPointMarkers from "@/components/ExecutionPointMarkers";
import {JobRecord, JobResource} from "@/app/types";
import {useEffect, useState, useMemo} from "react";
import DateTimePlayer from "@/components/DateTimePlayer";
import {Box, Typography} from "@mui/material";
import BoxStack from "@/components/BoxStack/BoxStack";
import {stringToColor} from "@/util/stringToColor";
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
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(1);

  const handlePause = () => setIsPaused(p => !p);
  const handleReset = () => { setTimeIndex(0); };

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

  const allJobs = Object.values(jobResources).flatMap(r => r.jobs).sort((a, b) => b.CompletionDate - a.CompletionDate);

  const jobsByRun = allJobs.reduce((acc, job) => {
    const runId = job.RunId || 'Unknown Run';
    if (!acc[runId]) {
      acc[runId] = {runId, jobs: []};
    }
    acc[runId].jobs.push(job);
    return acc;
  }, {} as Record<string, {runId: string, jobs: JobRecord[]}>)

  const jobsRan = allJobs.filter(j => j.CompletionDate <= time);
  const jobsThatWillRun = allJobs.filter(j => j.CompletionDate <= endTime);

  return (
    <>
      <TimelineProgressBar progress={( 1 - ((time - endTime) / (startTime - endTime))) * 100} />
      <Box
        sx={{
          position: 'absolute',
          bottom: 48,
          left: 16,
          zIndex: 1000,
          width: '20%',
          p: 2,
          borderRadius: 1,
        }}
      >
        {Object.entries(jobsByRun).reverse().map(([runId, { jobs }], index) => {

          if(jobs[29].JobStartDate > time) {
            return null
          }

          return (
            <Box key={runId}>
              <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                <Box
                  sx={{
                    borderRadius: '1px',
                    height: 20,
                    width: 20,
                    borderWidth: '0px',
                    borderStyle: 'solid',
                    backgroundColor: stringToColor(runId),
                    mr: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {runId.charAt(0).toUpperCase() + runId.charAt(1).toUpperCase()}
                </Box>
                <Box key={runId} display="flex" flexDirection="row" height={"100%"} flexWrap={'wrap'}
                     sx={{flexFlow: 'wrap'}} gap={.2} alignItems={'center'}>
                  <BoxStack
                    transform={"left"}
                    displayFunction={j => j.CompletionDate > time}
                    jobs={jobs}
                    mute={time == endTime}
                    size={8}
                  />
                </Box>
              </Box>

            </Box>
          )
        })}
        <Box
          sx={{
            mt:1,
            height: "8px",
            width: "315px",
            backgroundColor: 'black',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        ></Box>
        <Typography mt={1} variant="subtitle2" component="div">Training Epochs Grouped By Run</Typography>
      </Box>
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
            jobs={Object.values(jobsByRun).flatMap(r => r.jobs).sort((a, b) => a.CompletionDate - b.CompletionDate)}
            displayFunction={j => j.CompletionDate < time}
          />
        </Box>
        <Typography mt={1} textAlign={"right"} variant="subtitle2" component="div">Epochs Completed</Typography>
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
      <ExecutionPointMarkers time={time} jobResources={jobResources} />
      <DateTimePlayer time={time} isPaused={isPaused} speed={speed} setSpeed={setSpeed} onPause={handlePause} onReset={handleReset} />
    </>
  );
}

export default OSPoolJobTimeline;
