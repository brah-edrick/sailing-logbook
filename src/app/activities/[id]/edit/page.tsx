"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heading, Text, Link, Spinner, Center } from "@chakra-ui/react";
import { ActivityForm, ActivityFormFields } from "../../new/page";
import { toaster } from "@/components/ui/toaster";

export default function EditActivityPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const router = useRouter();
    const [activity, setActivity] = useState<any>(null);
    const [boats, setBoats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState<string>("");

    useEffect(() => {
        const getParams = async () => {
            const resolvedParams = await params;
            setId(resolvedParams.id);
        };
        getParams();
    }, [params]);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                // Fetch both activity and boats data
                const [activityRes, boatsRes] = await Promise.all([
                    fetch(`/api/activities/${id}`),
                    fetch("/api/boats")
                ]);

                if (activityRes.ok && boatsRes.ok) {
                    const [activityData, boatsData] = await Promise.all([
                        activityRes.json(),
                        boatsRes.json()
                    ]);
                    setActivity(activityData);
                    setBoats(boatsData);
                } else {
                    toaster.create({
                        title: "Error",
                        description: "Failed to load activity data",
                        type: "error",
                    });
                    router.push("/activities");
                }
            } catch (error) {
                toaster.create({
                    title: "Error",
                    description: "Error loading activity data",
                    type: "error",
                });
                router.push("/activities");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, router]);

    const handleSubmit = async (formData: ActivityFormFields) => {
        const payload = {
            boatId: Number(formData.boatId),
            startTime: new Date(formData.startTime).toISOString(),
            endTime: new Date(formData.endTime).toISOString(),
            departureLocation: formData.departureLocation || null,
            returnLocation: formData.returnLocation || null,
            distanceNm: formData.distanceNm ? Number(formData.distanceNm) : null,
            avgSpeedKnots: formData.avgSpeedKnots ? Number(formData.avgSpeedKnots) : null,
            weatherConditions: formData.weatherConditions || null,
            windSpeedKnots: formData.windSpeedKnots ? Number(formData.windSpeedKnots) : null,
            windDirection: formData.windDirection || null,
            seaState: formData.seaState || null,
            sailConfiguration: formData.sailConfiguration || null,
            purpose: formData.purpose || null,
            notes: formData.notes || null,
        };

        try {
            const res = await fetch(`/api/activities/${id}`, {
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
                router.push(`/activities/${id}`);
            } else {
                toaster.create({
                    title: "Error",
                    description: "Failed to update activity",
                    type: "error",
                });
            }
        } catch (error) {
            toaster.create({
                title: "Error",
                description: "Error updating activity",
                type: "error",
            });
        }
    };

    if (loading) {
        return (
            <main>
                <Center h="50vh">
                    <Spinner size="xl" color="white" />
                </Center>
            </main>
        );
    }

    if (!activity) {
        return (
            <main>
                <Text color="white">Activity not found</Text>
            </main>
        );
    }

    // Format datetime for datetime-local input
    const formatDateTimeLocal = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
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
        <main>
            <Link href={`/activities/${id}`}>
                <Text color="white">Back to Activity</Text>
            </Link>
            <Heading size="3xl" color="white" mb="6">
                Edit Activity
            </Heading>
            <ActivityForm
                onSubmit={handleSubmit}
                initialValues={initialValues}
                submitButtonText="Update Activity"
                boats={boats}
            />
        </main>
    );
}
