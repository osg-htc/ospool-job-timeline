'use client';

import {useEffect, useState} from 'react';

import {JobResource} from "../../page";
import ExecutionPointMarker from "./ExecutionPointMarker";
import {Box} from "@mui/material";

interface ExecutionPointMarkersProps {
  time: number;
  jobResources: Record<string, JobResource>;
  jobsPerRect: number;
}

const ExecutionPointMarkers = ({time, jobResources, jobsPerRect}: ExecutionPointMarkersProps) => {

  const markerHeight = 2;

  return (
    <>
      {Object.values(jobResources).sort((a, b) => b.latitude - a.latitude).map((r) => {
        const completedJobs = r.jobs.filter(j => j.CompletionDate <= time).length;
        const numRectangles = Math.ceil(completedJobs / jobsPerRect);

        const popupContent = (
          <Box>
            <Box>{r.name}</Box>
            <Box>Jobs Ran: {completedJobs}</Box>
          </Box>
        )

        return (
          <ExecutionPointMarker
            key={r.name}
            popupContent={popupContent}
            latitude={r.latitude}
            longitude={r.longitude}
            numberOfRectangles={numRectangles}
            markerHeight={markerHeight}
          />
        )
      })}
    </>
  )
}

export default ExecutionPointMarkers;
