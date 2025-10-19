"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Heading, Text, Link, Spinner, Center } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { ActivityFormFields, ActivityForm } from "@/components/form/activity";

export default function NewActivityPage() {
  const router = useRouter();
  const [boats, setBoats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const boatIdFromParams = searchParams.get("boatId");

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

  useEffect(() => {
    const fetchBoats = async () => {
      try {
        const res = await fetch("/api/boats");
        if (res.ok) {
          const boatsData = await res.json();
          setBoats(boatsData);
        }
      } catch (error) {
        console.error("Error fetching boats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoats();
  }, []);

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
        const activity = await res.json();
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
    } catch (error) {
      toaster.create({
        title: "Error",
        description: "Network error while creating activity",
        type: "error",
      });
    }
  };

  if (loading) {
    return (
      <main>
        <Center h="50vh">
          <Spinner size="xl" />
        </Center>
      </main>
    );
  }

  return (
    <main>
      <Link href="/activities">
        <Text>Back to Activities</Text>
      </Link>
      <Heading size="3xl" mb="6">
        Add New Activity
      </Heading>
      <ActivityForm
        onSubmit={handleSubmit}
        initialValues={initialValues}
        submitButtonText="Add Activity"
        boats={boats}
      />
    </main>
  );
}
