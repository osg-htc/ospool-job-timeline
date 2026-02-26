export interface JobRecord {
  GlobalJobId: string;
  JobStartDate: number;
  CompletionDate: number;
  MachineAttrAnnexName0: string | null;
  MachineAttrOSG_INSTITUTION_ID0: string | null;
  MachineAttrGLIDEIN_ResourceName0: string;
  ResourceName: string;
  longitude: number;
  latitude: number;
  EpochId: number;
  RunId: string;
}

export interface JobResource {
  key: string;
  name: string;
  longitude: number;
  latitude: number;
  jobs: JobRecord[];
}