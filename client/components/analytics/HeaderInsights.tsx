import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Zap, Cpu } from "lucide-react";

export default function HeaderInsights({ headerInsights, cloudJobs }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Most Frequent Tag Combination
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold">
            {headerInsights.mostFrequentTags.tags?.join(" + ")}
          </div>
          <p className="text-xs text-muted-foreground">
            {(
              (headerInsights.mostFrequentTags.support / 100) *
              cloudJobs?.length
            )?.toFixed(1)}{" "}
            out of {cloudJobs?.length} jobs
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Most Recommended Resource
          </CardTitle>
          <Cpu className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold">
            {headerInsights.mostRecommendedResource.resource}
          </div>
          <p className="text-xs text-muted-foreground">
            {headerInsights.mostRecommendedResource.avgConfidence}% confidence
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Most Frequent 3-Job Group
          </CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-sm font-bold">
            {headerInsights.mostFrequentJobGroup.jobs?.join(" + ")}
          </div>
          <p className="text-xs text-muted-foreground">
            {headerInsights.mostFrequentJobGroup.support}% support
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Average Frequent Jobs per Sequence
          </CardTitle>
          <div className="h-4 w-4 rounded-full bg-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {headerInsights.avgJobsPerSequence}
          </div>
          <p className="text-xs text-muted-foreground">Across all workflows</p>
        </CardContent>
      </Card>
    </div>
  );
}
