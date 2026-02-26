import {stringToColor} from "@/util/stringToColor";
import StackedBox from "@/components/BoxStack/StackedBox";
import {JobRecord} from "@/app/types";
import {Typography} from "@mui/material";

interface BoxStackProps {
  jobs: JobRecord[]
  transform?: "bottom" | "top" | "left" | "right";
}

const SCALING_FACTOR = 11;

const BoxStack = ({jobs, transform} : BoxStackProps) => {
  return (
    <>
      {jobs.map((j, index) => (
        <StackedBox
          key={j.GlobalJobId}
          color={stringToColor(j.RunId.toString(), 60, 70)}
          borderColor={stringToColor(j.MachineAttrAnnexName0 || j.ResourceName)}
          scalingFactor={SCALING_FACTOR}
          transform={transform || "bottom"}
        >
          <Typography variant="subtitle2" sx={{fontSize: '.5rem', textAlign: 'center'}} component="div">
            {j.RunId.toString()}
          </Typography>
        </StackedBox>
      ))}
    </>
  )
}

export default BoxStack;