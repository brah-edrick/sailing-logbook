// API Response Types - These reflect what actually comes back from JSON APIs

export interface ApiBoat {
  id: number;
  name: string;
  type: string | null;
  make: string;
  model: string | null;
  year: number | null;
  lengthFt: number;
  beamFt: number | null;
  sailNumber: string | null;
  homePort: string | null;
  owner: string | null;
  notes: string | null;
  colorHex: string | null;
}

export interface ApiSailingActivity {
  id: number;
  boatId: number;
  startTime: string; // ISO string from JSON
  endTime: string; // ISO string from JSON
  departureLocation: string | null;
  returnLocation: string | null;
  distanceNm: number | null;
  avgSpeedKnots: number | null;
  weatherConditions: string | null;
  windSpeedKnots: number | null;
  windDirection: string | null;
  seaState: string | null;
  sailConfiguration: string | null;
  purpose: string | null;
  notes: string | null;
  boat?: ApiBoat; // Included when fetching activities with boat data
}

// Type for activities that include boat information
export interface ApiSailingActivityWithBoat extends ApiSailingActivity {
  boat: ApiBoat;
}

// Report types
export interface ReportMetrics {
  hoursSailed: number;
  nauticalMiles: number;
  eventCount: number;
}

// General activities report (all activities)
export interface ApiActivitiesReport {
  total: ReportMetrics;
  byBoatType: Record<string, ReportMetrics>;
  byActivityType: Record<string, ReportMetrics>;
  byBoatLength: Record<string, ReportMetrics>;
}

// Boat-specific report (activities for a single boat)
export interface ApiBoatReport {
  boatId: number;
  boatName: string;
  total: ReportMetrics;
  byActivityType: Record<string, ReportMetrics>;
  byMonth: Record<string, ReportMetrics>;
  byYear: Record<string, ReportMetrics>;
}
