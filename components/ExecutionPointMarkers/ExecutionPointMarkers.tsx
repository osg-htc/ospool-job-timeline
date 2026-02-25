'use client';

import {Marker} from 'react-map-gl/mapbox';

import {JobRecord, JobResource} from "@/app/types";

interface ExecutionPointMarkersProps {
  time: number;
  jobResources: Record<string, JobResource>;
}

const ExecutionPointMarkers = ({time, jobResources}: ExecutionPointMarkersProps) => {



  return (
    <>
      {Object.values(jobResources).map((r) => {

        const height = r.jobs.filter((j: JobRecord) => time > j.CompletionDate).length;
        // compute a pixel height so the svg is visible even when `height` is 0
        const markerHeight = height * 2

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
              height={markerHeight}
              viewBox={`0 0 24 ${markerHeight}`}
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              style={{display: 'block'}}
            >
              {/* single rectangle whose height equals markerHeight and is visible */}
              <rect x={8} y={0} width={8} height={markerHeight} fill="#1f2937" rx={2} />
            </svg>
          </Marker>
        )
      })}
    </>
  )
}

export default ExecutionPointMarkers;
