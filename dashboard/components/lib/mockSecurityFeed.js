// Mock SOC feed — shape conforms to data-contracts/soc-metrics.schema.json.
// Required: activeVendors, endpointHealth, threatsBlocked, hipaaScore (numbers).
// Optional: timeseries (array). Stub data only; no live systems access.
export const mockSecurityFeed = {
  activeVendors: 14,
  endpointHealth: 98.2,
  threatsBlocked: 142,
  hipaaScore: 95,
  timeseries: [
    { time: "00:00", threats: 2 },
    { time: "04:00", threats: 5 },
    { time: "08:00", threats: 12 },
    { time: "12:00", threats: 4 },
    { time: "16:00", threats: 8 },
    { time: "20:00", threats: 3 },
  ],
};
