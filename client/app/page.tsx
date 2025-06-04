"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomPagination from "@/components/CustomPagination";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Cpu, HardDrive, Zap, Clock } from "lucide-react";
import { useContext } from "react";
import CloudJobContext from "@/store";
import useFetch from "@/hooks/use-fetch";

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "running":
      return "bg-blue-100 text-blue-800";
    case "failed":
      return "bg-red-100 text-red-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

function computeAverageResources(jobs) {
  if (!jobs || jobs.length === 0) {
    return { averageCPU: 0, averageRAM: 0, averageGPU: 0 };
  }

  const totalResources = jobs.reduce(
    (totals, job) => {
      const { cpu, ram, gpu } = job.resources;
      return {
        cpu: totals.cpu + parseInt(cpu, 10),
        ram: totals.ram + parseInt(ram, 10),
        gpu: totals.gpu + parseInt(gpu, 10),
      };
    },
    { cpu: 0, ram: 0, gpu: 0 }
  );

  const jobCount = jobs.length;

  return {
    averageCPU: totalResources.cpu / jobCount,
    averageRAM: totalResources.ram / jobCount,
    averageGPU: totalResources.gpu / jobCount,
  };
}
const ITEMS_PER_PAGE = 10;
const URL = "http://localhost:3001";

export default function Dashboard() {
  const { cloudJobs } = useContext(CloudJobContext);
  const {
    data: searchData,
    loading: searchLoading,
    fetchData: fetchSearchData,
  } = useFetch(`${URL}/api/search`, { method: "POST" });

  const completedJobs = cloudJobs.filter((job) => job.status === "completed");
  const failedJobs = cloudJobs.filter((job) => job.status === "failed");
  const averageResources = computeAverageResources(cloudJobs);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const filteredJobs =
    !!debouncedQuery && searchData?.length
      ? cloudJobs
          .filter((job) =>
            searchData.some(
              (searchResult) => searchResult.job_id === job.job_id
            )
          )
          .map((job) => {
            const matchedSearchResult = searchData.find(
              (searchResult) => searchResult.job_id === job.job_id
            );
            return {
              ...job,
              score: matchedSearchResult?.score || 0,
            };
          })
          .sort((a, b) => b.score - a.score)
      : cloudJobs;
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery.trim() !== "") {
      fetchSearchData({ body: { query: debouncedQuery } });
    }
  }, [debouncedQuery, fetchSearchData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Cloud Job Dashboard
        </h1>
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search jobs..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cloudJobs.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Jobs
            </CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedJobs.length}</div>
            <p className="text-xs text-muted-foreground">
              {(
                (completedJobs.length /
                  (failedJobs.length + completedJobs.length)) *
                100
              ).toFixed(1)}
              % success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Jobs</CardTitle>
            <div className="h-4 w-4 rounded-full bg-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{failedJobs.length}</div>
            <p className="text-xs text-muted-foreground">
              {(
                (failedJobs.length /
                  (failedJobs.length + completedJobs.length)) *
                100
              ).toFixed(1)}
              % failure rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Resources
            </CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <Cpu className="h-3 w-3" />
                <span>{averageResources.averageCPU.toFixed(2)} CPU cores</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <HardDrive className="h-3 w-3" />
                <span>{averageResources.averageRAM.toFixed(2)} GB RAM</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-3 w-3" />
                <span>{averageResources.averageGPU.toFixed(2)} GPU Units</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {!!debouncedQuery && searchData?.length && (
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Cosine Similarity Score
                    </th>
                  )}
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Job ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    User
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Job Name
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Tags
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Resources
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Duration
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Submission Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">
                    Sequence ID
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedJobs.map((job) => (
                  <tr
                    key={job.job_id}
                    className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    {!!debouncedQuery && searchData?.length && (
                      <td className="py-3 px-4 font-mono text-sm">
                        {job.score.toFixed(5)}
                      </td>
                    )}
                    <td className="py-3 px-4 font-mono text-sm">
                      {job.job_id}
                    </td>
                    <td className="py-3 px-4">{job.user}</td>
                    <td className="py-3 px-4 font-medium">{job.job_name}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1 flex-wrap">
                        {job.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm space-y-1">
                        <div>CPU: {job.resources.cpu}</div>
                        <div>RAM: {job.resources.ram}GB</div>
                        <div>GPU: {job.resources.gpu}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{job.duration} min</td>
                    <td className="py-3 px-4">{job.submitted}</td>
                    <td className="py-3 px-4 font-mono text-sm">
                      {job.sequence_id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Card>
    </div>
  );
}
