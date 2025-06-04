"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useContext } from "react";
import CloudJobContext from "@/store";
import cleanDecimal from "@/lib/cleanDecimal";

export default function FrequentJobs() {
  const { freqGroups } = useContext(CloudJobContext);

  const filtered3JobGroups = freqGroups
    ?.filter((group) => group.length === 3)
    .sort((a, b) => b.support - a.support);

  const downloadFrequentGroupsCSV = () => {
    if (!freqGroups || freqGroups?.length === 0) {
      console.error("No data to download.");
      return;
    }
    const headers = ["support", "itemsets", "length"];

    const rows = freqGroups.map((item) => {
      return [item.support, `"${item.itemsets.join(", ")}"`, item.length].join(
        ","
      );
    });

    const csvContent = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.setAttribute("href", url);
    link.setAttribute("download", "frequent_groups.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <Card>
      <CardHeader className="flex flex-row">
        <CardTitle className="flex items-center gap-2 flex-1">
          Frequent Job Groupings (Across Sequences)
        </CardTitle>
        <Button onClick={downloadFrequentGroupsCSV}>
          <Download />
          CSV
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Top 5 Frequent 2-Job Groupings
          </h3>
          <div className="space-y-3">
            {freqGroups?.slice(0, 5).map((group, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 flex-wrap">
                    {group.itemsets.map((job, jobIndex) => (
                      <Badge
                        key={jobIndex}
                        variant="secondary"
                        className="text-xs"
                      >
                        {job}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-sm font-medium">
                    {cleanDecimal(`${group.support * 100}`)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${group.support * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Top 5 Frequent 3-Job Groupings
          </h3>
          <div className="space-y-3">
            {filtered3JobGroups?.slice(0, 5).map((group, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 flex-wrap">
                    {group.itemsets.map((job, jobIndex) => (
                      <Badge
                        key={jobIndex}
                        variant="secondary"
                        className="text-xs"
                      >
                        {job}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-sm font-medium">
                    {cleanDecimal(`${group.support * 100}`)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${group.support * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
