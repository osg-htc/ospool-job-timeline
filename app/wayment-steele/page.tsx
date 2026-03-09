import fs from 'fs'
import { Box } from "@mui/material";

import Map from "@/components/Map";
import OSPoolJobTimeline from "./components/OSPoolJobTimeline";

export interface JobRecord {
  GlobalJobId: string;
  JobStartDate: number;
  CompletionDate: number;
  ResourceName: string;
  longitude: number;
  latitude: number;
  institution_name: string;
}

export interface JobResource {
  key: string;
  name: string;
  longitude: number;
  latitude: number;
  jobs: JobRecord[];
}

export default async function Home() {

  const apMarkersFile = await fs.promises.readFile('public/data/wayment_steele_ads.json', 'utf-8')
  const jobRecords: JobRecord[] = JSON.parse(apMarkersFile)

  const startTime = Math.min(...jobRecords.map(j => j.JobStartDate));
  const endTime = Math.max(...jobRecords.map(j => j.CompletionDate));

  jobRecords.sort((a, b) => a.CompletionDate - b.CompletionDate)

  const jobResources = jobRecords.reduce((acc, job) => {
    const name = job['institution_name']
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

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Map>
        <OSPoolJobTimeline startTime={startTime} endTime={endTime} jobResources={jobResources} />
      </Map>
    </Box>
  );
}



