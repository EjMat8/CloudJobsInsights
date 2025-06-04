"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

import { Download } from "lucide-react";
import { useContext } from "react";
import CloudJobContext from "@/store";
import cleanDecimal from "@/lib/cleanDecimal";
import { useState } from "react";
import CustomPagination from "@/components/CustomPagination";
const ITEMS_PER_PAGE = 5;
export default function AssociationRules() {
  const { assocRules, cloudJobs } = useContext(CloudJobContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "confidence",
    direction: "desc",
  });
  const [filteredRules, setFilteredRules] = useState(assocRules);

  const totalPages = Math.ceil(filteredRules?.length / ITEMS_PER_PAGE);

  const sortedRules =
    filteredRules?.length &&
    [...filteredRules]?.sort((a, b) => {
      const { key, direction } = sortConfig;
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

  const paginatedRules = sortedRules?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const handleResourceValueChange = (value = "all") => {
    if (value === "all") {
      setFilteredRules(assocRules);
    } else {
      const filtered = assocRules.filter((rule) =>
        rule.consequents.some((consequent) => consequent.includes(value))
      );
      setFilteredRules(filtered);
    }
    setCurrentPage(1);
  };

  const numCloudJobs = cloudJobs?.length || 0;

  const downloadAssocRulesCSV = () => {
    if (!assocRules || assocRules?.length === 0) {
      console.error("No data to download.");
      return;
    }

    const headers = [
      "antecedents",
      "consequents",
      "support",
      "confidence",
      "lift",
    ];

    const rows = assocRules.map((rule) => {
      return [
        `"${rule.antecedents.join(", ")}"`,
        `"${rule.consequents.join(", ")}"`,
        rule.support,
        rule.confidence,
        rule.lift,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.setAttribute("href", url);
    link.setAttribute("download", "rules.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (assocRules?.length) setFilteredRules(assocRules);
  }, [assocRules?.length]);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          Association Rules (Common Tag Combinations & Their Resource Needs)
        </CardTitle>
        <Button onClick={downloadAssocRulesCSV}>
          <Download />
          CSV
        </Button>
        <Select
          defaultValue="all"
          onValueChange={(value) => {
            handleResourceValueChange(value);
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by resource" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Resources</SelectItem>
            <SelectItem value="gpu">GPU</SelectItem>
            <SelectItem value="cpu">CPU</SelectItem>
            <SelectItem value="ram">RAM</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-500">
                  Antecedents
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">
                  Consequents
                </th>
                <th
                  className="text-left py-3 px-4 font-medium text-gray-500 cursor-pointer hover:text-blue-600 hover:underline"
                  onClick={() => handleSort("support")}
                >
                  Support
                </th>
                <th
                  className="text-left py-3 px-4 font-medium text-gray-500 cursor-pointer hover:text-blue-600 hover:underline "
                  onClick={() => handleSort("confidence")}
                >
                  Confidence (%)
                </th>
                <th
                  className="text-left py-3 px-4 font-medium text-gray-500 cursor-pointer hover:text-blue-600 hover:underline"
                  onClick={() => handleSort("lift")}
                >
                  Lift
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedRules?.map((rule, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex gap-1 flex-wrap">
                      {rule.antecedents.map((tag) => (
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
                    {rule.consequents.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className={`text-xs text-gray-200 font-mono ${
                          tag.includes("cpu")
                            ? "bg-sky-600"
                            : tag.includes("ram")
                            ? "bg-green-600"
                            : tag.includes("gpu")
                            ? "bg-purple-600"
                            : ""
                        }`}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-normal">
                        <span className="font-semibold">
                          {cleanDecimal(String(rule.support * numCloudJobs))}
                        </span>{" "}
                        jobs out of {numCloudJobs}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Progress
                        value={rule.confidence * 100}
                        className="w-16 h-2"
                      />
                      <span className="text-sm font-medium">
                        {cleanDecimal(`${rule.confidence * 100}`)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={rule.lift > 1.5 ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {cleanDecimal(String(rule.lift))}
                    </Badge>
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
  );
}
