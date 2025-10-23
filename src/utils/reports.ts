import { ApiSailingActivity } from "@/types/api";

export interface ReportMetrics {
  hoursSailed: number;
  nauticalMiles: number;
  eventCount: number;
}

export interface ActivityWithBoat {
  id: number;
  boatId: number;
  startTime: string;
  endTime: string;
  distanceNm: number | null;
  purpose: string | null;
  boat?: {
    id: number;
    type: string | null;
    lengthFt: number | null;
  };
}

/**
 * Calculate duration in hours between two timestamps
 */
export function calculateDurationHours(
  startTime: string,
  endTime: string
): number {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMs = end.getTime() - start.getTime();
  return durationMs / (1000 * 60 * 60);
}

/**
 * Calculate total metrics for a set of activities
 */
export function calculateTotalMetrics(
  activities: ActivityWithBoat[]
): ReportMetrics {
  const metrics: ReportMetrics = {
    hoursSailed: 0,
    nauticalMiles: 0,
    eventCount: activities.length,
  };

  activities.forEach((activity) => {
    if (activity.startTime && activity.endTime) {
      metrics.hoursSailed += calculateDurationHours(
        activity.startTime,
        activity.endTime
      );
    }

    if (activity.distanceNm) {
      metrics.nauticalMiles += activity.distanceNm;
    }
  });

  return metrics;
}

/**
 * Group activities by a specific field and calculate metrics for each group
 */
export function groupActivitiesByField(
  activities: ActivityWithBoat[],
  getGroupKey: (activity: ActivityWithBoat) => string
): Record<string, ReportMetrics> {
  return activities.reduce(
    (acc, activity) => {
      const groupKey = getGroupKey(activity);

      if (!acc[groupKey]) {
        acc[groupKey] = {
          hoursSailed: 0,
          nauticalMiles: 0,
          eventCount: 0,
        };
      }

      if (activity.startTime && activity.endTime) {
        acc[groupKey].hoursSailed += calculateDurationHours(
          activity.startTime,
          activity.endTime
        );
      }

      if (activity.distanceNm) {
        acc[groupKey].nauticalMiles += activity.distanceNm;
      }

      acc[groupKey].eventCount += 1;
      return acc;
    },
    {} as Record<string, ReportMetrics>
  );
}

/**
 * Group activities by boat type
 */
export function groupByBoatType(
  activities: ActivityWithBoat[]
): Record<string, ReportMetrics> {
  return groupActivitiesByField(
    activities,
    (activity) => activity.boat?.type || "Unknown"
  );
}

/**
 * Group activities by activity type (purpose)
 */
export function groupByActivityType(
  activities: ActivityWithBoat[]
): Record<string, ReportMetrics> {
  return groupActivitiesByField(
    activities,
    (activity) => activity.purpose || "Unknown"
  );
}

/**
 * Group activities by boat length (10ft increments)
 */
export function groupByBoatLength(
  activities: ActivityWithBoat[]
): Record<string, ReportMetrics> {
  return groupActivitiesByField(activities, (activity) => {
    const length = activity.boat?.lengthFt;
    if (!length) return "Unknown";

    // Round down to nearest 10ft increment
    const lengthBucket = Math.floor(length / 10) * 10;
    return `${lengthBucket}-${lengthBucket + 9}ft`;
  });
}

/**
 * Get boat length bucket for a given length
 */
export function getBoatLengthBucket(length: number | null): string {
  if (!length) return "Unknown";

  const lengthBucket = Math.floor(length / 10) * 10;
  return `${lengthBucket}-${lengthBucket + 9}ft`;
}
