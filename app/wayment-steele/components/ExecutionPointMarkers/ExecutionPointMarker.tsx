import {Marker, Popup} from "react-map-gl/mapbox";
import {stringToColor} from "@/util/stringToColor";
import {ReactNode, useState} from "react";

interface ExecutionPointMarkerProps {
  numberOfRectangles: number;
  markerHeight: number;
  latitude: number;
  longitude: number;
  popupContent: ReactNode
}

const ExecutionPointMarker = ({numberOfRectangles, markerHeight, popupContent, latitude, longitude}: ExecutionPointMarkerProps) => {

  const [hoveredResource, setHoveredResource] = useState<boolean>(false);

  const markerSize = 12;
  const svgWidth = 28;
  const stackHeight = markerHeight * numberOfRectangles;
  const totalHeight = stackHeight + markerSize;
  const id = `${latitude}-${longitude}`;

  return (
    <>
      <Marker
        key={id}
        longitude={longitude}
        latitude={latitude}
        anchor="bottom"
      >
        {/* SVG height is driven by markerHeight so it scales with `height` */}
        <svg
          width={svgWidth}
          height={totalHeight}
          viewBox={`0 0 ${svgWidth} ${totalHeight}`}
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          style={{display: 'block', cursor: 'pointer'}}
          onMouseEnter={() => setHoveredResource(true)}
          onMouseLeave={() => setHoveredResource(false)}
        >
          {Array.from({length: numberOfRectangles}, (_, i) => (
            <rect
              key={i}
              x={svgWidth / 2 - markerSize / 2}
              y={(numberOfRectangles - 1 - i) * markerHeight}
              width={markerSize}
              height={markerHeight}
              fill={stringToColor(`${id}-${i}`)}
              rx={1}
            />
          ))}
          <circle cx={svgWidth / 2} cy={totalHeight - markerSize / 2} r={markerSize / 2} fill="orange" stroke="#c85000"
                  strokeWidth={1.5}/>
        </svg>
      </Marker>
      {hoveredResource && (() => {
        return (
          <Popup
            longitude={longitude}
            latitude={latitude}
            anchor="top"
            closeButton={false}
            closeOnClick={false}
            style={{pointerEvents: 'none'}}
          >
            {popupContent}
          </Popup>
        );
      })()}
    </>
  )
}

export default ExecutionPointMarker;
