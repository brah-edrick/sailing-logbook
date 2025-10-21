"use client";

import { useRouter } from "next/navigation";
import { ActivityFormFields, ActivityForm } from "@/components/form/activity";
import { toaster } from "@/components/ui/toaster";
import { ApiSailingActivity, ApiBoat } from "@/types/api";

interface EditActivityFormProps {
  activity: ApiSailingActivity;
  boats: ApiBoat[];
}

export function EditActivityForm({ activity, boats }: EditActivityFormProps) {
  const router = useRouter();

  const handleSubmit = async (formData: ActivityFormFields) => {
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
      weatherConditions: formData.weatherConditions || null,
      windSpeedKnots: formData.windSpeedKnots
        ? Number(formData.windSpeedKnots)
        : null,
      windDirection: formData.windDirection || null,
      seaState: formData.seaState || null,
      sailConfiguration: formData.sailConfiguration || null,
      purpose: formData.purpose || null,
      notes: formData.notes || null,
    };

    try {
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
          description: "Failed to update activity",
          type: "error",
        });
      }
    } catch {
      toaster.create({
        title: "Error",
        description: "Error updating activity",
        type: "error",
      });
    }
  };

  // Format datetime for datetime-local input
  const formatDateTimeLocal = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const initialValues: ActivityFormFields = {
    boatId: activity.boatId?.toString() || "",
    startTime: formatDateTimeLocal(activity.startTime),
    endTime: formatDateTimeLocal(activity.endTime),
    departureLocation: activity.departureLocation || "",
    returnLocation: activity.returnLocation || "",
    distanceNm: activity.distanceNm?.toString() || "",
    avgSpeedKnots: activity.avgSpeedKnots?.toString() || "",
    weatherConditions: activity.weatherConditions || "",
    windSpeedKnots: activity.windSpeedKnots?.toString() || "",
    windDirection: activity.windDirection || "",
    seaState: activity.seaState || "",
    sailConfiguration: activity.sailConfiguration || "",
    purpose: activity.purpose || "",
    notes: activity.notes || "",
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
