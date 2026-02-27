'use client';

import {Marker} from 'react-map-gl/mapbox';

import {JobRecord, JobResource} from "@/app/types";
import {stringToColor} from "@/util/stringToColor";

interface ExecutionPointMarkersProps {
  time: number;
  jobResources: Record<string, JobResource>;
}

const ExecutionPointMarkers = ({time, jobResources}: ExecutionPointMarkersProps) => {



  return (
    <>
      {Object.values(jobResources).map((r) => {

        const jobsRan = r.jobs.filter((j: JobRecord) => time > j.CompletionDate);
        // compute a pixel height so the svg is visible even when `height` is 0
        const markerHeight = 2

        return (
          <Marker
            key={r.name}
            longitude={r.longitude}
            latitude={r.latitude}
            anchor="bottom"
          >
            {/* SVG height is driven by markerHeight so it scales with `height` */}
            <svg
              width={24}
              height={markerHeight * jobsRan.length}
              viewBox={`0 0 24 ${markerHeight * jobsRan.length}`}
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              style={{display: 'block'}}
            >
              {
                jobsRan.length > 0 && (
                  jobsRan.map((j: JobRecord, i) => (
                    <rect key={j.GlobalJobId} x={8} y={(jobsRan.length - i) * markerHeight} width={8} height={markerHeight} fill={stringToColor(j.RunId)} rx={2} />
                  ))
                )
              }
            </svg>
          </Marker>
        )
      })}
    </>
  )
}

export default ExecutionPointMarkers;
