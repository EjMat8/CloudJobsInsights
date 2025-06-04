"use client";
import { Cloud } from "lucide-react";
import { createContext, useState, useEffect } from "react";
import useFetch from "../hooks/use-fetch";

const CloudJobContext = createContext({
  cloudJobs: [],
  freqGroups: [],
  initNumJobs: 0,
  assocRules: [],
  fetchCloudJobs: () => {},
  cloudStatus: { cloudJobsLoading: false, cloudJobsError: null },
  freqStatus: { freqGroupsLoading: false, freqGroupsError: null },
  fetchAssocRules: () => {},
  fetchFreqGroups: () => {},
  addJob: (job) => {},
  assocStatus: { assocRulesLoading: false, assocRulesError: null },
  setInitNumJobs: () => {},
});
const URL = "http://localhost:3001";
export const CloudJobProvider = ({ children }) => {
  const [initNumJobs, setInitNumJobs] = useState(0);
  const {
    data: cloudJobs,
    loading: cloudJobsLoading,
    error: cloudJobsError,
    fetchData: fetchCloudJobs,
  } = useFetch(`${URL}/api/jobs`, { method: "GET" });

  const {
    data: assocRules,
    loading: assocRulesLoading,
    error: assocRulesError,
    fetchData: fetchAssocRules,
  } = useFetch(`${URL}/api/rules`, { method: "GET" });

  const {
    data: freqGroups,
    loading: freqGroupsLoading,
    error: freqGroupsError,
    fetchData: fetchFreqGroups,
  } = useFetch(`${URL}/api/groupings`, { method: "GET" });

  const { fetchData: sendNewJob } = useFetch(`${URL}/api/jobs`, {
    method: "POST",
  });

  // Local state to manage cloudJobs
  const [jobs, setJobs] = useState([]);

  // Sync the local state with fetched data when it changes
  useEffect(() => {
    if (cloudJobs) {
      setJobs(cloudJobs);
      setInitNumJobs((prev) => (prev === 0 ? cloudJobs.length : prev));
    }
  }, [cloudJobs]);

  // Function to append a new job to the cloudJobs array
  const addJob = async (newJob) => {
    try {
      await sendNewJob({ body: newJob });
      setJobs((prevJobs) => [newJob, ...prevJobs]);
      alert("Job added successfully!");
    } catch (err) {
      console.error("Error adding job:", err);
      alert("Failed to add job. Please try again. ", err);
    }
  };

  return (
    <CloudJobContext.Provider
      value={{
        cloudStatus: { cloudJobsLoading, cloudJobsError },
        cloudJobs: jobs || [],
        fetchCloudJobs,
        fetchAssocRules,
        initNumJobs,
        assocStatus: { assocRulesLoading, assocRulesError },
        assocRules,
        freqGroups,
        freqStatus: {
          freqGroupsLoading,
          freqGroupsError,
        },
        fetchFreqGroups,
        addJob,
        setInitNumJobs,
      }}
    >
      {children}
    </CloudJobContext.Provider>
  );
};

export default CloudJobContext;
