import z from "zod";

export const activitySchema = z.object({
  boatId: z.number(),
  startTime: z.string(),
  endTime: z.string(),
  departureLocation: z.string().nullable(),
  returnLocation: z.string().nullable(),
  distanceNm: z.number().nullable(),
  avgSpeedKnots: z.number().nullable(),
  weatherConditions: z
    .enum(["sunny", "cloudy", "rainy", "foggy", "other", "stormy"])
    .nullable(),
  windSpeedKnots: z.number().nullable(),
  windDirection: z
    .enum(["n", "ne", "e", "se", "s", "sw", "w", "nw"])
    .nullable(),
  seaState: z.enum(["calm", "light", "moderate", "rough"]).nullable(),
  sailConfiguration: z.string().nullable(),
  purpose: z
    .enum(["racing", "cruising", "training", "charter", "delivery", "other"])
    .nullable(),
  notes: z.string().nullable(),
});
