export default (assocRules, freqGroups) => {
  const mostFrequentTags = assocRules?.reduce(
    (max, rule) => {
      return rule.support > max.support ? rule : max;
    },
    { support: 0 }
  );

  const resourceConfMap = {};
  assocRules?.forEach((rule) => {
    const resource = rule.consequents[0];
    if (!resourceConfMap[resource]) resourceConfMap[resource] = [];
    resourceConfMap[resource].push(rule.confidence);
  });

  const mostRecommendedResource = Object.entries(resourceConfMap)
    .map(([resource, confidences]) => ({
      resource,
      avgConfidence:
        confidences.reduce((a, b) => a + b, 0) / confidences.length,
    }))
    .sort((a, b) => b.avgConfidence - a.avgConfidence)[0];

  const mostFrequentJobGroup = freqGroups
    ?.filter((group) => group.length === 3)
    .sort((a, b) => b.support - a.support)[0];

  const avgJobsPerSequence = (
    freqGroups?.reduce((sum, group) => sum + group.length, 0) /
    freqGroups?.length
  ).toFixed(1);

  return {
    mostFrequentTags: {
      tags: mostFrequentTags?.antecedents,
      support: +(mostFrequentTags?.support * 100).toFixed(1),
    },
    mostRecommendedResource: {
      resource: mostRecommendedResource?.resource,
      avgConfidence: +(mostRecommendedResource?.avgConfidence * 100).toFixed(1),
    },
    mostFrequentJobGroup: {
      jobs: mostFrequentJobGroup?.itemsets,
      support: +(mostFrequentJobGroup?.support * 100).toFixed(1),
    },
    avgJobsPerSequence: +avgJobsPerSequence,
  };
};
