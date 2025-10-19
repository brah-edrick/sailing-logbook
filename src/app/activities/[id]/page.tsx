"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Card, DataList, Flex, Heading, Stack, Text, Spinner, Center } from "@chakra-ui/react"
import Link from "next/link";

interface DataListItemProps {
    label: string;
    value: string | undefined | null;
}

const DataListItemComponent: React.FC<DataListItemProps> = ({ label, value }) => {
    if (!value) return null;
    return (
        <DataList.Item>
            <DataList.ItemLabel>{label}</DataList.ItemLabel>
            <DataList.ItemValue>{value}</DataList.ItemValue>
        </DataList.Item>
    );
};

export default function ActivityDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const router = useRouter();
    const [activity, setActivity] = useState<any>(null);
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

        const fetchActivity = async () => {
            try {
                const res = await fetch(`/api/activities/${id}`);
                if (res.ok) {
                    const activityData = await res.json();
                    setActivity(activityData);
                } else if (res.status === 404) {
                    router.push("/404");
                } else {
                    console.error("Failed to fetch activity");
                }
            } catch (error) {
                console.error("Error fetching activity:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
    }, [id, router]);

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const calculateDuration = (startTime: string, endTime: string) => {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const durationMs = end.getTime() - start.getTime();
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
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
                <Center h="50vh">
                    <Text color="white" fontSize="xl">Activity not found</Text>
                </Center>
            </main>
        );
    }

    return (
        <main>
            <div>
                <Link href="/activities">
                    <Text color="white">Back to Activities</Text>
                </Link>
            </div>
            <div>
                <header>
                    <Flex justifyContent="space-between" py="4">
                        <Heading color="white" size="3xl">
                            Activity - {formatDateTime(activity.startTime)}
                        </Heading>
                        <Stack direction="row" gap="2">
                            <Button variant="surface" asChild>
                                <Link href={`/activities/${activity.id}/edit`}>Edit</Link>
                            </Button>
                            <Button variant="surface" color="red.500">Delete</Button>
                        </Stack>
                    </Flex>
                </header>

                <Stack gap="6">
                    <Card.Root>
                        <Card.Header>
                            <Card.Title>Activity Details</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <DataList.Root orientation="horizontal">
                                <DataListItemComponent label="Boat" value={activity.boat?.name} />
                                <DataListItemComponent label="Purpose" value={activity.purpose} />
                                <DataListItemComponent label="Start Time" value={formatDateTime(activity.startTime)} />
                                <DataListItemComponent label="End Time" value={formatDateTime(activity.endTime)} />
                                <DataListItemComponent label="Duration" value={calculateDuration(activity.startTime, activity.endTime)} />
                            </DataList.Root>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root>
                        <Card.Header>
                            <Card.Title>Location & Navigation</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <DataList.Root orientation="horizontal">
                                <DataListItemComponent label="Departure Location" value={activity.departureLocation} />
                                <DataListItemComponent label="Return Location" value={activity.returnLocation} />
                                <DataListItemComponent label="Distance (NM)" value={activity.distanceNm?.toString()} />
                                <DataListItemComponent label="Average Speed (knots)" value={activity.avgSpeedKnots?.toString()} />
                            </DataList.Root>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root>
                        <Card.Header>
                            <Card.Title>Weather & Conditions</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <DataList.Root orientation="horizontal">
                                <DataListItemComponent label="Weather Conditions" value={activity.weatherConditions} />
                                <DataListItemComponent label="Wind Speed (knots)" value={activity.windSpeedKnots?.toString()} />
                                <DataListItemComponent label="Wind Direction" value={activity.windDirection} />
                                <DataListItemComponent label="Sea State" value={activity.seaState} />
                                <DataListItemComponent label="Sail Configuration" value={activity.sailConfiguration} />
                            </DataList.Root>
                        </Card.Body>
                    </Card.Root>

                    {activity.notes && (
                        <Card.Root>
                            <Card.Header>
                                <Card.Title>Notes</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Text color="white">{activity.notes}</Text>
                            </Card.Body>
                        </Card.Root>
                    )}
                </Stack>
            </div>
        </main>
    );
}
