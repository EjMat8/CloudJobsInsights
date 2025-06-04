"use client";

import { Sparkles } from "lucide-react";
import AssociationRules from "@/components/analytics/AssociationRules";
import FrequentJobs from "@/components/analytics/FrequentJobs";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import CloudJobContext from "@/store";
import useFetch from "@/hooks/use-fetch";
import extractHeaderInsights from "@/lib/extractHeaderInsights.js";
import HeaderInsights from "@/components/analytics/HeaderInsights";

export default function Analytics() {
  const {
    initNumJobs,
    cloudJobs,
    fetchAssocRules,
    fetchFreqGroups,
    freqGroups,
    assocRules,
    assocStatus: { assocRulesLoading },
    freqStatus: { freqGroupsLoading },
    setInitNumJobs,
  } = useContext(CloudJobContext);
  const { fetchData: mineData, loading: mineLoading } = useFetch(
    "http://localhost:3001/api/recompute",
    { method: "POST" }
  );
  const changeInData = initNumJobs != cloudJobs?.length;
  const isLoading = assocRulesLoading || freqGroupsLoading || mineLoading;

  const handleMineData = async () => {
    try {
      await mineData();
      fetchAssocRules();
      fetchFreqGroups();
      setInitNumJobs(cloudJobs?.length);
    } catch (error) {
      console.error("Error mining data:", error);
    }
  };
  const headerInsights = extractHeaderInsights(assocRules, freqGroups);
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Job Insights</h1>
        <div className="flex items-center gap-2">
          {changeInData && (
            <p className="text-lg font-bold text-amber-600">
              New data detected. Run mining to refresh analysis.
            </p>
          )}
          <Button
            className="bg-orange-950 hover:bg-red-800"
            disabled={!changeInData}
            onClick={handleMineData}
          >
            Mine
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          <div className="relative">
            <div className="w-14 h-14 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
            <Sparkles className="absolute top-1/2 left-1/2 w-6 h-6 -translate-x-1/2 -translate-y-1/2 text-amber-500" />
          </div>
          <p className="text-lg font-semibold text-amber-700">
            Mining new insights...
          </p>
          <p className="text-sm text-gray-500">This may take a few moments</p>
        </div>
      ) : (
        <>
          <HeaderInsights
            headerInsights={headerInsights}
            cloudJobs={cloudJobs}
          />
          <AssociationRules />
          <FrequentJobs />
        </>
      )}
    </div>
  );
}
