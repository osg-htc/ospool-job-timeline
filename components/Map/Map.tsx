'use client'

import {ReactNode, useEffect, useState} from "react";
import Map from "react-map-gl/mapbox"
import 'mapbox-gl/dist/mapbox-gl.css';
import {Box} from '@mui/material';

function BaseMap({children}: {children: ReactNode}) {

  const [mounted, setMounted] = useState(false);

  return (
    <>
      <Box component={'div'} style={{
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: "white",
        borderRadius: 1,
        zIndex: 999,
        height: '100vh',
        width: '100vw'
      }}>
        <Map
          mapboxAccessToken="pk.eyJ1IjoiY2Fubm9uLWxvY2siLCJhIjoiY21tMTUxbjhqMDVnaDJxcHE2eWp6aGo2ZiJ9.oZFr4GezivM26AkP87Cg-w"
          initialViewState={{
            longitude: -92.4,
            latitude: 37.8,
            zoom: 3
          }}
          projection={'globe'}
          style={{width: "100%", height: "100%"}}
          mapStyle={"mapbox://styles/mapbox/light-v11"} // "mapbox://styles/cannon-lock/cm9u8lv2400fd01qt9yvj8nyz/draft"
          onLoad={() => setMounted(true)}
        >
          {mounted && children}
        </Map>
      </Box>
    </>
  )
}

export default BaseMap;
