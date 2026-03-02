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
      {Object.values(jobResources).sort((a, b) => a.latitude - b.latitude).map((r) => {

        const jobsRan = r.jobs.filter((j: JobRecord) => time > j.CompletionDate);
        // compute a pixel height so the svg is visible even when `height` is 0
        const markerHeight = 2

        const isOspool = r.jobs[0].MachineAttrAnnexName0 === null
        const markerSize = 8;
        const svgWidth = 28;
        const stackHeight = markerHeight * jobsRan.length;
        const totalHeight = stackHeight + markerSize;

        return (
          <Marker
            key={r.name}
            longitude={r.longitude}
            latitude={r.latitude}
            anchor="bottom"
          >
            {/* SVG height is driven by markerHeight so it scales with `height` */}
            <svg
              width={svgWidth}
              height={totalHeight}
              viewBox={`0 0 ${svgWidth} ${totalHeight}`}
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              style={{display: 'block'}}
            >
              {
                jobsRan.length > 0 && (
                  jobsRan.map((j: JobRecord, i) => (
                    <rect key={j.GlobalJobId} x={svgWidth / 2 - markerSize / 2} y={(jobsRan.length - 1 - i) * markerHeight} width={markerSize} height={markerHeight} fill={stringToColor(j.RunId)} rx={1} />
                  ))
                )
              }
              {isOspool
                ? <circle cx={svgWidth / 2} cy={totalHeight - markerSize / 2} r={markerSize / 2} fill="orange" stroke="#c85000" strokeWidth={1.5} />
                : <rect x={svgWidth / 2 - markerSize / 2} y={totalHeight - markerSize} width={markerSize} height={markerSize} fill="black" stroke="#333" strokeWidth={1.5} />
              }
            </svg>
          </Marker>
        )
      })}
    </>
  )
}

export default ExecutionPointMarkers;
