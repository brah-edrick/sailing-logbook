"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Box, Button, Flex, Heading, Spinner, Center, Text, Table } from "@chakra-ui/react";

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
};

const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
};

export default function ActivitiesPage() {
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const res = await fetch("/api/activities");
                if (res.ok) {
                    const activitiesData = await res.json();
                    setActivities(activitiesData);
                } else {
                    console.error("Failed to fetch activities");
                }
            } catch (error) {
                console.error("Error fetching activities:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);





    if (loading) {
        return (
            <main>
                <Center h="50vh">
                    <Spinner size="xl" color="white" />
                </Center>
            </main>
        );
    }

    return (
        <main>
            <Flex justifyContent="space-between" gap="4" py="4">
                <Heading size="3xl" color="white">Activities</Heading>
                <Button variant="surface" asChild>
                    <Link href="/activities/new">+ Add New Activity</Link>
                </Button>
            </Flex>

            {activities.length === 0 ? (
                <Center h="40vh">
                    <Text color="white" fontSize="lg">No activities found. Create your first activity!</Text>
                </Center>
            ) : (
                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader color="white">Date</Table.ColumnHeader>
                            <Table.ColumnHeader color="white">Boat</Table.ColumnHeader>
                            <Table.ColumnHeader color="white">Duration</Table.ColumnHeader>
                            <Table.ColumnHeader color="white">Purpose</Table.ColumnHeader>
                            <Table.ColumnHeader color="white">Distance (NM)</Table.ColumnHeader>
                            <Table.ColumnHeader color="white">Avg Speed (kts)</Table.ColumnHeader>
                            <Table.ColumnHeader color="white">Wind (kts)</Table.ColumnHeader>
                            <Table.ColumnHeader color="white"></Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {activities.map((activity) => (
                            <Table.Row key={activity.id}>
                                <Table.Cell>
                                    <Text color="white">{formatDate(activity.startTime)}</Text>
                                </Table.Cell>
                                <Table.Cell>
                                    <Flex alignItems="center" gap="2">
                                        {activity.boat?.colorHex && (
                                            <Box
                                                style={{ backgroundColor: activity.boat.colorHex }}
                                                borderRadius="full"
                                                boxSize="12px"
                                            />
                                        )}
                                        <Text color="white">{activity.boat?.name || 'Unknown Boat'}</Text>
                                    </Flex>
                                </Table.Cell>
                                <Table.Cell>
                                    <Text color="white">{calculateDuration(activity.startTime, activity.endTime)}</Text>
                                </Table.Cell>
                                <Table.Cell>
                                    <Text color="white">{activity.purpose || '-'}</Text>
                                </Table.Cell>
                                <Table.Cell>
                                    <Text color="white">{activity.distanceNm || '-'}</Text>
                                </Table.Cell>
                                <Table.Cell>
                                    <Text color="white">{activity.avgSpeedKnots || '-'}</Text>
                                </Table.Cell>
                                <Table.Cell>
                                    <Text color="white">{activity.windSpeedKnots || '-'}</Text>
                                </Table.Cell>
                                <Table.Cell>
                                    <Flex gap="2" justifyContent="end">
                                        <Button size="sm" variant="outline" asChild>
                                            <Link href={`/activities/${activity.id}/edit`}>Edit</Link>
                                        </Button>
                                        <Button size="sm" variant="surface" asChild>
                                            <Link href={`/activities/${activity.id}`}>View</Link>
                                        </Button>
                                    </Flex>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            )}
        </main>
    );
}
