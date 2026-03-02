import {stringToColor} from "@/util/stringToColor";
import StackedBox from "@/components/BoxStack/StackedBox";
import {JobRecord} from "@/app/types";
import {Typography} from "@mui/material";

interface BoxStackProps {
  jobs: JobRecord[];
  displayFunction?: (job: JobRecord) => boolean;
  transform?: "bottom" | "top" | "left" | "right";
  size?: number;
  mute?: boolean;
}

const SCALING_FACTOR = 12;

const BoxStack = ({jobs, displayFunction, transform, size, mute = false} : BoxStackProps) => {
  return (
    <>
      {jobs.map((j, index) => (
        <StackedBox
          key={j.GlobalJobId}
          display={displayFunction ? displayFunction(j) : true}
          color={mute ? stringToColor(j.RunId, 20, 40) :stringToColor(j.RunId) }
          borderColor={colorScale[j.EpochId]}
          scalingFactor={SCALING_FACTOR}
          transform={transform || "bottom"}
          size={size}
        >
          <Typography variant="subtitle2" sx={{fontSize: '.5rem', textAlign: 'center'}} component="div">
            {<>&nbsp;</> || j.RunId}
          </Typography>
        </StackedBox>
      ))}
    </>
  )
}

const colorScale = ['#ffffff', '#fcfcdb', '#f5f8c8', '#eef4ba', '#e7efad', '#dfeba2', '#d8e798', '#d0e28f', '#c8de87', '#c0da7e', '#b8d577', '#b1d170', '#a9cc69', '#a1c862', '#99c35b', '#91bf55', '#89ba4f', '#81b649', '#79b143', '#71ad3d', '#69a838', '#61a432', '#58a02d', '#509b27', '#479722', '#3d921c', '#338e16', '#27890f', '#198407', '#008000']

export default BoxStack;