"use client";

import { useRouter } from "next/navigation";
import { ActivityFormFields, ActivityForm } from "@/components/form/activity";
import { toaster } from "@/components/ui/toaster";
import { ApiBoat } from "@/types/api";

interface NewActivityFormProps {
  boats: ApiBoat[];
  boatIdFromParams?: string;
}

export function NewActivityForm({
  boats,
  boatIdFromParams,
}: NewActivityFormProps) {
  const router = useRouter();

  const initialValues: ActivityFormFields = {
    boatId: boatIdFromParams || "",
    startTime: "",
    endTime: "",
    departureLocation: "",
    returnLocation: "",
    distanceNm: "",
    avgSpeedKnots: "",
    weatherConditions: "",
    windSpeedKnots: "",
    windDirection: "",
    seaState: "",
    sailConfiguration: "",
    purpose: "",
    notes: "",
  };

  const handleSubmit = async (activity: ActivityFormFields) => {
    try {
      const payload = {
        boatId: Number(activity.boatId),
        startTime: new Date(activity.startTime).toISOString(),
        endTime: new Date(activity.endTime).toISOString(),
        departureLocation: activity.departureLocation || null,
        returnLocation: activity.returnLocation || null,
        distanceNm: activity.distanceNm ? Number(activity.distanceNm) : null,
        avgSpeedKnots: activity.avgSpeedKnots
          ? Number(activity.avgSpeedKnots)
          : null,
        weatherConditions: activity.weatherConditions || null,
        windSpeedKnots: activity.windSpeedKnots
          ? Number(activity.windSpeedKnots)
          : null,
        windDirection: activity.windDirection || null,
        seaState: activity.seaState || null,
        sailConfiguration: activity.sailConfiguration || null,
        purpose: activity.purpose || null,
        notes: activity.notes || null,
      };

      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toaster.create({
          title: "Success",
          description: "Activity created successfully",
          type: "success",
        });
        router.push(`/activities`);
      } else {
        toaster.create({
          title: "Error",
          description: "Failed to create activity",
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
