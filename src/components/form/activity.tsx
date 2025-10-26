"use client";

import { useRouter } from "next/navigation";
import { toaster } from "@/components/toaster";
import { ApiSailingActivity, ApiBoat } from "@/types/api";
import { ActivityForm } from "./activityForm";
import {
  type ActivityFormInput,
  type WeatherCondition,
  type WindDirection,
  type SeaState,
  type ActivityPurpose,
} from "@/validation/schemas";

// Edit Activity Form Component
export function EditActivityForm({
  activity,
  boats,
}: {
  activity: ApiSailingActivity;
  boats: ApiBoat[];
}) {
  const router = useRouter();

  const formatDateTimeLocal = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const initialValues: Partial<ActivityFormInput> = {
    boatId: activity.boatId.toString(),
    startTime: formatDateTimeLocal(activity.startTime),
    endTime: formatDateTimeLocal(activity.endTime),
    departureLocation: activity.departureLocation || "",
    returnLocation: activity.returnLocation || "",
    distanceNm: activity.distanceNm?.toString() || "",
    avgSpeedKnots: activity.avgSpeedKnots?.toString() || "",
    weatherConditions: activity.weatherConditions as WeatherCondition | null,
    windSpeedKnots: activity.windSpeedKnots?.toString() || "",
    windDirection: activity.windDirection as WindDirection | null,
    seaState: activity.seaState as SeaState | null,
    sailConfiguration: activity.sailConfiguration || "",
    purpose: activity.purpose as ActivityPurpose | null,
    notes: activity.notes || "",
  };

  const handleSubmit = async (formData: ActivityFormInput) => {
    try {
      const payload = {
        boatId: Number(formData.boatId),
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        departureLocation: formData.departureLocation || null,
        returnLocation: formData.returnLocation || null,
        distanceNm: formData.distanceNm ? Number(formData.distanceNm) : null,
        avgSpeedKnots: formData.avgSpeedKnots
          ? Number(formData.avgSpeedKnots)
          : null,
        weatherConditions: formData.weatherConditions,
        windSpeedKnots: formData.windSpeedKnots
          ? Number(formData.windSpeedKnots)
          : null,
        windDirection: formData.windDirection,
        seaState: formData.seaState,
        sailConfiguration: formData.sailConfiguration || null,
        purpose: formData.purpose,
        notes: formData.notes || null,
      };

      const res = await fetch(`/api/activities/${activity.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toaster.create({
          title: "Success",
          description: "Activity updated successfully",
          type: "success",
        });
        router.push(`/activities/${activity.id}`);
      } else {
        toaster.create({
          title: "Error",
          description: "Failed to update activity, please try again",
          type: "error",
        });
      }
    } catch {
      toaster.create({
        title: "Error",
        description: "Network error while updating activity",
        type: "error",
      });
    }
  };

  return (
    <ActivityForm
      onSubmit={handleSubmit}
      initialValues={initialValues}
      submitButtonText="Update Activity"
      boats={boats}
    />
  );
}

// New Activity Form Component
export function NewActivityForm({
  boats,
  boatIdFromParams,
}: {
  boats: ApiBoat[];
  boatIdFromParams?: string;
}) {
  const router = useRouter();

  const initialValues: Partial<ActivityFormInput> = {
    boatId: boatIdFromParams || "",
    startTime: "",
    endTime: "",
    departureLocation: "",
    returnLocation: "",
    distanceNm: "",
    avgSpeedKnots: "",
    weatherConditions: null,
    windSpeedKnots: "",
    windDirection: null,
    seaState: null,
    sailConfiguration: "",
    purpose: null,
    notes: "",
  };

  const handleSubmit = async (formData: ActivityFormInput) => {
    try {
      const payload = {
        boatId: Number(formData.boatId),
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        departureLocation: formData.departureLocation || null,
        returnLocation: formData.returnLocation || null,
        distanceNm: formData.distanceNm ? Number(formData.distanceNm) : null,
        avgSpeedKnots: formData.avgSpeedKnots
          ? Number(formData.avgSpeedKnots)
          : null,
        weatherConditions: formData.weatherConditions,
        windSpeedKnots: formData.windSpeedKnots
          ? Number(formData.windSpeedKnots)
          : null,
        windDirection: formData.windDirection,
        seaState: formData.seaState,
        sailConfiguration: formData.sailConfiguration || null,
        purpose: formData.purpose,
        notes: formData.notes || null,
      };

      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const activity = await res.json();
        toaster.create({
          title: "Success",
          description: "Activity created successfully",
          type: "success",
        });
        router.push(`/activities/${activity.id}`);
      } else {
        toaster.create({
          title: "Error",
          description: "Failed to create activity, please try again",
          type: "error",
        });
      }
    } catch {
      toaster.create({
        title: "Error",
        description: "Network error while creating activity",
        type: "error",
      });
    }
  };

  return (
    <ActivityForm
      onSubmit={handleSubmit}
      initialValues={initialValues}
      submitButtonText="Add Activity"
      boats={boats}
    />
  );
}
