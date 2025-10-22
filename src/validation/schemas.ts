import { z } from "zod";

// ============================================================================
// ENUMS - Shared enum definitions
// ============================================================================

const boatTypeEnum = z.enum(["monohull", "trimaran", "catamaran"]);
const weatherEnum = z.enum([
  "sunny",
  "cloudy",
  "rainy",
  "foggy",
  "other",
  "stormy",
]);
const windDirectionEnum = z.enum(["n", "ne", "e", "se", "s", "sw", "w", "nw"]);
const seaStateEnum = z.enum(["calm", "light", "moderate", "rough"]);
const purposeEnum = z.enum([
  "racing",
  "cruising",
  "training",
  "charter",
  "delivery",
  "other",
]);

// ============================================================================
// COMMON FIELD DEFINITIONS - Reusable field validators
// ============================================================================

const commonStringField = z.string().nullable();
const requiredStringField = (message: string) => z.string().min(1, message);
const colorHexField = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format")
  .nullable();

// ============================================================================
// BOAT SCHEMAS - All boat-related validation schemas
// ============================================================================

const baseBoatSchema = {
  name: requiredStringField("Name is required"),
  type: boatTypeEnum.nullable(),
  make: requiredStringField("Make is required"),
  model: commonStringField,
  sailNumber: commonStringField,
  homePort: commonStringField,
  owner: commonStringField,
  notes: commonStringField,
  colorHex: colorHexField,
};

export const boatApiSchema = z.object({
  ...baseBoatSchema,
  year: z
    .number()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .nullable()
    .optional(),
  lengthFt: z.number().min(0.1, "Length must be greater than 0"),
  beamFt: z.number().min(0.1).nullable(),
});

export const boatFormSchema = z.object({
  ...baseBoatSchema,
  year: z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) =>
        !val ||
        (!isNaN(Number(val)) &&
          Number(val) >= 1900 &&
          Number(val) <= new Date().getFullYear() + 1),
      "Year must be between 1900 and current year"
    ),
  lengthFt: z
    .string()
    .min(1, "Length is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Length must be a positive number"
    ),
  beamFt: z
    .string()
    .nullable()
    .refine(
      (val) => !val || (!isNaN(Number(val)) && Number(val) > 0),
      "Beam must be a positive number"
    ),
});

// ============================================================================
// ACTIVITY SCHEMAS - All activity-related validation schemas
// ============================================================================

const baseActivitySchema = {
  startTime: z.string(),
  endTime: z.string(),
  departureLocation: commonStringField,
  returnLocation: commonStringField,
  weatherConditions: weatherEnum.nullable(),
  windDirection: windDirectionEnum.nullable(),
  seaState: seaStateEnum.nullable(),
  sailConfiguration: commonStringField,
  purpose: purposeEnum.nullable(),
  notes: commonStringField,
};

export const activityApiSchema = z.object({
  ...baseActivitySchema,
  boatId: z.number().min(1, "Boat is required"),
  startTime: z.string().datetime("Invalid start time format"),
  endTime: z.string().datetime("Invalid end time format"),
  distanceNm: z.number().min(0).nullable(),
  avgSpeedKnots: z.number().min(0).nullable(),
  windSpeedKnots: z.number().min(0).nullable(),
});

export const activityFormSchema = z.object({
  ...baseActivitySchema,
  boatId: z.string().min(1, "Boat is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  distanceNm: z
    .string()
    .nullable()
    .refine(
      (val) => !val || (!isNaN(Number(val)) && Number(val) >= 0),
      "Distance must be a positive number"
    ),
  avgSpeedKnots: z
    .string()
    .nullable()
    .refine(
      (val) => !val || (!isNaN(Number(val)) && Number(val) >= 0),
      "Speed must be a positive number"
    ),
  windSpeedKnots: z
    .string()
    .nullable()
    .refine(
      (val) => !val || (!isNaN(Number(val)) && Number(val) >= 0),
      "Wind speed must be a positive number"
    ),
});

// ============================================================================
// TYPESCRIPT TYPES - Exported types for use throughout the application
// ============================================================================

// Enum types extracted from schemas for reuse
export type BoatType = z.infer<typeof boatTypeEnum>;
export type WeatherCondition = z.infer<typeof weatherEnum>;
export type WindDirection = z.infer<typeof windDirectionEnum>;
export type SeaState = z.infer<typeof seaStateEnum>;
export type ActivityPurpose = z.infer<typeof purposeEnum>;

// Boat types
export type BoatApiInput = z.infer<typeof boatApiSchema>;
export type BoatFormInput = z.infer<typeof boatFormSchema>;

// Activity types
export type ActivityApiInput = z.infer<typeof activityApiSchema>;
export type ActivityFormInput = z.infer<typeof activityFormSchema>;
