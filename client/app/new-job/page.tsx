"use client";

import React, { useContext, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CloudJobContext from "@/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import SmartSuggestions from "@/components/new-job/SmartSuggestions";

function recommendTopPerCategoryWithDetails(rules, userTags) {
  const bestPerCategory = {
    cpu: null,
    gpu: null,
    ram: null,
  };

  rules.forEach((rule) => {
    const isMatch = rule.antecedents.every((tag) => userTags.includes(tag));
    if (!isMatch) return;

    rule.consequents.forEach((conseq) => {
      const lower = conseq.toLowerCase();
      const score = rule.confidence * rule.lift;

      if (lower.startsWith("cpu")) {
        if (!bestPerCategory.cpu || score > bestPerCategory.cpu.score) {
          bestPerCategory.cpu = { ...rule, consequent: conseq, score };
        }
      } else if (lower.startsWith("gpu")) {
        if (!bestPerCategory.gpu || score > bestPerCategory.gpu.score) {
          bestPerCategory.gpu = { ...rule, consequent: conseq, score };
        }
      } else if (lower.startsWith("ram")) {
        if (!bestPerCategory.ram || score > bestPerCategory.ram.score) {
          bestPerCategory.ram = { ...rule, consequent: conseq, score };
        }
      }
    });
  });

  return Object.values(bestPerCategory)
    .filter(Boolean)
    .map((entry) => ({
      consequent: entry.consequent,
      support: parseFloat(entry.support.toFixed(4)),
      confidence: parseFloat(entry.confidence.toFixed(4)),
      lift: parseFloat(entry.lift.toFixed(4)),
      score: parseFloat(entry.score.toFixed(4)),
    }));
}

export default function NewJob() {
  const { cloudJobs, assocRules, addJob } = useContext(CloudJobContext);
  const tags = [...new Set(cloudJobs.flatMap((job) => job.tags))];

  const [jobName, setJobName] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [cpu, setCpu] = useState("");
  const [ram, setRam] = useState("");
  const [gpu, setGpu] = useState("");

  const suggestions = assocRules
    ? recommendTopPerCategoryWithDetails(assocRules, selectedTags)
    : [];

  console.log(suggestions);

  const addTag = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const applySingleSuggestion = (type, value) => {
    if (type === "cpu") setCpu(value.toString());
    else if (type === "ram") setRam(value.toString());
    else if (type === "gpu") setGpu(value.toString());
  };

  const applyAllSuggestions = () => {
    suggestions.forEach((sugg) => {
      const [type, value] = sugg.consequent.split("=");
      applySingleSuggestion(type, parseInt(value));
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addJob({
      job_id: `job_${cloudJobs.length + 1}`,
      user: "test_user",
      job_name: jobName,
      tags: [...selectedTags],
      status: "pending",
      resources: { cpu: Number(cpu), ram: Number(ram), gpu: Number(gpu) },
      duration: "60",
      submitted: new Date().toISOString().split("T")[0],
      sequence_id: "seq_201",
    });
    setJobName("");
    setSelectedTags([]);
    setCpu("");
    setRam("");
    setGpu("");
  };

  if (!cloudJobs) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Create New Job</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="jobName">Job Name</Label>
                  <Input
                    id="jobName"
                    value={jobName}
                    onChange={(e) => setJobName(e.target.value)}
                    placeholder="Enter job name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <Select onValueChange={addTag}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tags" />
                    </SelectTrigger>
                    <SelectContent>
                      {tags.map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2 flex-wrap mt-2">
                    {selectedTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cpu">CPU (cores)</Label>
                    <Input
                      id="cpu"
                      type="number"
                      value={cpu}
                      onChange={(e) => setCpu(e.target.value)}
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ram">RAM (GB)</Label>
                    <Input
                      id="ram"
                      type="number"
                      value={ram}
                      onChange={(e) => setRam(e.target.value)}
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gpu">GPU (units)</Label>
                    <Input
                      id="gpu"
                      type="number"
                      value={gpu}
                      onChange={(e) => setGpu(e.target.value)}
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Submit Job
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <SmartSuggestions
          applyAllSuggestions={applyAllSuggestions}
          applySingleSuggestion={applySingleSuggestion}
          suggestions={suggestions}
        />
      </div>
    </div>
  );
}
