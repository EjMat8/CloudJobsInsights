"use client";
import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Lightbulb, Cpu, HardDrive, Zap, CheckCircle } from "lucide-react";

export default function SmartSuggestions({
  suggestions,
  applySingleSuggestion,
  applyAllSuggestions,
}) {
  return (
    <div>
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-6">
          {suggestions.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-amber-400" />
                <h3 className="text-2xl font-bold">Smart Suggestions</h3>
              </div>
              <p className="text-sm text-gray-600">
                Based on your selected tags, here are some resource
                recommendations:
              </p>

              <div className="space-y-4">
                {suggestions.map((resource, index) => {
                  const [resourceType, valueString] =
                    resource.consequent.split("=");
                  const resourceValue = Number.parseInt(valueString);
                  const ResourceIcon =
                    resourceType === "cpu"
                      ? Cpu
                      : resourceType === "ram"
                      ? HardDrive
                      : Zap;
                  const resourceLabel =
                    resourceType === "cpu"
                      ? "CPU"
                      : resourceType === "ram"
                      ? "RAM"
                      : "GPU";
                  const resourceUnit =
                    resourceType === "cpu"
                      ? "cores"
                      : resourceType === "ram"
                      ? "GB"
                      : "units";

                  return (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <ResourceIcon className="h-5 w-5 text-gray-700" />
                          <span className="text-md font-semibold text-gray-800">
                            {resourceLabel}: {resourceValue} {resourceUnit}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            applySingleSuggestion(resourceType, resourceValue)
                          }
                          className="text-xs"
                        >
                          Apply
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        <div className="bg-gray-50 p-3 rounded border text-center">
                          <div className="text-xs text-gray-500 mb-0.5">
                            Score
                          </div>
                          <div className="font-bold text-xl text-gray-900">
                            {resource.score.toFixed(2)}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="bg-gray-50 p-2 rounded border text-center">
                            <div className="text-xs text-gray-500 mb-0.5">
                              Confidence
                            </div>
                            <div className="font-semibold text-gray-700">
                              {(resource.confidence * 100).toFixed(0)}%
                            </div>
                          </div>
                          <div className="bg-gray-50 p-2 rounded border text-center">
                            <div className="text-xs text-gray-500 mb-0.5">
                              Lift
                            </div>
                            <div className="font-semibold text-gray-700">
                              {resource.lift.toFixed(1)}x
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button
                onClick={applyAllSuggestions}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Apply All
              </Button>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Lightbulb className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm font-medium text-gray-600 mb-1">
                No suggestions yet.
              </p>
              <p className="text-xs text-gray-500">
                Add some tags to get personalized recommendations.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
