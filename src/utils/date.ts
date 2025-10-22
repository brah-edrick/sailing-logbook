export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

export const calculateDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMs = end.getTime() - start.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Format string values for display
export const formatDisplayValue = (
  value: string | null | undefined,
  fieldName?: string
): string => {
  if (!value) return "";

  // Wind direction should be uppercase
  if (fieldName === "windDirection") {
    return value.toUpperCase();
  }

  // Check if the string is already properly capitalized (has mixed case or all caps)
  const hasMixedCase = /[A-Z]/.test(value) && /[a-z]/.test(value);
  const isAllCaps = value === value.toUpperCase() && value.length > 1;

  // If it's already properly formatted, return as-is
  if (hasMixedCase || isAllCaps) {
    return value;
  }

  // Otherwise, capitalize first letter and keep the rest lowercase
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

// Get unit for field display
export const getFieldUnit = (fieldName?: string): string => {
  const units: Record<string, string> = {
    lengthFt: "ft",
    beamFt: "ft",
    distanceNm: "NM",
    avgSpeedKnots: "knots",
    windSpeedKnots: "knots",
  };

  return units[fieldName || ""] || "";
};
