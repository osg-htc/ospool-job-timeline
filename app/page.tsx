import fs from 'fs'
import { Box } from "@mui/material";

import Map from "@/components/Map";
import {JobRecord, JobResource} from "@/app/types";
import OSPoolJobTimeline from "@/components/OSPoolJobTimeline";


export default async function Home() {

  const apMarkersFile = await fs.promises.readFile('public/data/jobs.json', 'utf-8')
  const jobRecords: JobRecord[] = JSON.parse(apMarkersFile)

  const startTime = Math.min(...jobRecords.map(j => j.JobStartDate));
  const endTime = Math.max(...jobRecords.map(j => j.CompletionDate));

  console.log("Input jobs:", jobRecords.length)

  // Add in incomplete jobs
  const runIds = [...new Set(jobRecords.map(j => j.RunId))]
  runIds.forEach(k => {

    // Make sure to remove jobs with duplicate (RunId, EpochId) pairs, keeping only the one with the latest CompletionDate
    const jobsForRun = jobRecords.filter(j => j.RunId === k)
    const uniqueJobsForRun = Object.values(jobsForRun.reduce((acc, job) => {
      const key = `${job.RunId}-${job.EpochId}`
      const jobRunTime = job.CompletionDate - job.JobStartDate

      // If we haven't seen this (RunId, EpochId) pair before, or if this job ran longer then the one we've seen before, keep this job
      if (!acc[key] || jobRunTime > acc[key].runTime ) {
        acc[key] = {
          jobRecord: job,
          runTime: jobRunTime
        }
      }
      return acc
    }, {} as Record<string, {jobRecord: JobRecord, runTime: number}>))

    // Remove the original jobs for this RunId and replace with the deduplicated list
    for (const job of jobsForRun) {
      const index = jobRecords.findIndex(j => j.GlobalJobId === job.GlobalJobId)
      if (index !== -1) {
        jobRecords.splice(index, 1)
      }
    }
    jobRecords.push(...uniqueJobsForRun.map(x => x.jobRecord))
  })

  console.log("Total jobs after deduplication:", jobRecords.length)

  runIds.forEach(runId => {
    // Make sure there are at least 30 jobs for each RunId, if not add in incomplete jobs with a very high CompletionDate so they appear at the end of the timeline
    while (jobRecords.filter(j => j.RunId === runId).length < 30) {
      const incompleteJob = {...jobRecords.filter(j => j.RunId === runId)[0]}
      incompleteJob.CompletionDate = 9999999999999;
      // Make a random GlobalJobId that is not in the dataset
      incompleteJob.GlobalJobId = `incomplete-${Math.random()}`

      jobRecords.push(incompleteJob);
    }
  })

  runIds.forEach(runId => {
    const jobsForRun = jobRecords.filter(j => j.RunId === runId)
    if (jobsForRun.length > 30) {
      console.warn(`RunId ${runId} has more than 30 jobs (${jobsForRun.length}). This may indicate a problem with the dataset.`)
    }
    if (jobsForRun.length < 30) {
      console.warn(`RunId ${runId} has less than 30 jobs (${jobsForRun.length}). This may indicate a problem with the dataset.`)
    }
  })


  jobRecords.sort((a, b) => a.CompletionDate - b.CompletionDate)

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

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Map>
        <OSPoolJobTimeline startTime={startTime} endTime={endTime} jobResources={jobResources} />
      </Map>
    </Box>
  );
}



