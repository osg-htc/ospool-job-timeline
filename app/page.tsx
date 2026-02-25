import fs from 'fs'
import { Box } from "@mui/material";

import Map from "@/components/Map";
import {JobRecord, JobResource} from "@/app/types";
import OSPoolJobTimeline from "@/components/OSPoolJobTimeline";


export default async function Home() {

  const apMarkersFile = await fs.promises.readFile('public/data/jobs.json', 'utf-8')
  const jobRecords: JobRecord[] = JSON.parse(apMarkersFile)

  const jobResources = jobRecords.reduce((acc, job) => {
    const name = job.MachineAttrAnnexName0 || job.ResourceName || 'Unknown'
    const key = `${name}-${job.latitude}-${job.longitude}`

    if (!acc[key]) {
      acc[key] = {
        key,
        name,
        latitude: job.latitude,
        longitude: job.longitude,
        jobs: []
      }
    }

    acc[key].jobs.push(job)
    return acc
  }, {} as Record<string, JobResource>)

  const startTime = Math.min(...jobRecords.map(j => j.JobStartDate));
  const endTime = Math.max(...jobRecords.map(j => j.CompletionDate));

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Map>
        <OSPoolJobTimeline startTime={startTime} endTime={endTime} jobResources={jobResources} />
      </Map>
    </Box>
  );
}



