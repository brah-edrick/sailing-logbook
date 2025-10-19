"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  DataList,
  Flex,
  Heading,
  Stack,
  Text,
  Spinner,
  Center,
  Dialog,
  Portal,
  CloseButton,
  SimpleGrid,
  GridItem,
  Table,
} from "@chakra-ui/react";
import Link from "next/link";
import { toaster } from "@/components/ui/toaster";
import { calculateDuration, formatDate } from "@/app/activities/page";

export default function BoatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [boat, setBoat] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
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

    const fetchBoat = async () => {
      try {
        const res = await fetch(`/api/boats/${id}`);
        if (res.ok) {
          const boatData = await res.json();
          setBoat(boatData);
        } else if (res.status === 404) {
          router.push("/404");
        } else {
          console.error("Failed to fetch boat");
        }
      } catch (error) {
        console.error("Error fetching boat:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoat();
  }, [id, router]);

  useEffect(() => {
    const fetchActivities = async () => {
      const res = await fetch(`/api/boats/${id}/activities`);
      if (res.ok) {
        const activitiesData = await res.json();
        setActivities(activitiesData);
      }
    };
    fetchActivities();
  }, [id, router]);

  if (loading) {
    return (
      <main>
        <Center h="50vh">
          <Spinner size="xl" />
        </Center>
      </main>
    );
  }

  if (!boat) {
    return (
      <main>
        <Center h="50vh">
          <Text fontSize="xl">Boat not found</Text>
        </Center>
      </main>
    );
  }

  const handleDelete = async () => {
    const res = await fetch(`/api/boats/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toaster.create({
        title: "Success",
        description: `${boat.name} deleted successfully`,
        type: "success",
      });
      router.push("/boats");
    }
  };

  return (
    <main>
      <div>
        <Link href="/boats">
          <Text>Back to Boats</Text>
        </Link>
      </div>
      <div>
        <header>
          <Flex justifyContent="space-between" py="4">
            <Heading size="3xl">
              <Flex alignItems="baseline" gap="1">
                <Text>{boat.name}</Text>
                <Box
                  style={{ backgroundColor: boat.colorHex || "#FFFFFF" }}
                  borderRadius="full"
                  boxSize="24px"
                  ml="2"
                />
              </Flex>
            </Heading>
            <Stack direction="row" gap="2">
              <Link href={`/activities/new?boatId=${boat.id}`}>
                <Button variant="surface">+ Add New Activity</Button>
              </Link>
              <Button variant="surface" asChild>
                <Link href={`/boats/${boat.id}/edit`}>Edit</Link>
              </Button>
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <Button variant="surface" color="red.500">
                    Delete
                  </Button>
                </Dialog.Trigger>
                <Portal>
                  <Dialog.Backdrop />
                  <Dialog.Positioner>
                    <Dialog.Content>
                      <Dialog.Header>
                        <Dialog.Title>Dialog Title</Dialog.Title>
                      </Dialog.Header>
                      <Dialog.Body>
                        <Text>
                          Are you sure you want to delete {boat.name}?
                        </Text>
                      </Dialog.Body>
                      <Dialog.Footer>
                        <Dialog.ActionTrigger asChild>
                          <Button variant="outline">Cancel</Button>
                        </Dialog.ActionTrigger>
                        <Dialog.ActionTrigger asChild>
                          <Button
                            onClick={handleDelete}
                            variant="surface"
                            color="red.500"
                          >
                            Confirm Delete {boat.name}
                          </Button>
                        </Dialog.ActionTrigger>
                      </Dialog.Footer>
                      <Dialog.CloseTrigger asChild>
                        <CloseButton size="sm" />
                      </Dialog.CloseTrigger>
                    </Dialog.Content>
                  </Dialog.Positioner>
                </Portal>
              </Dialog.Root>
            </Stack>
          </Flex>
        </header>
        <SimpleGrid columns={3} gap={4}>
          <Card.Root>
            <Card.Header>
              <Text>Details</Text>
            </Card.Header>
            <Card.Body>
              <DataList.Root orientation="horizontal">
                <DataListItemComponent label="Type" value={boat.type} />
                <DataListItemComponent label="Make" value={boat.make} />
                <DataListItemComponent label="Model" value={boat.model} />
                <DataListItemComponent
                  label="Year"
                  value={boat.year?.toString()}
                />
                <DataListItemComponent
                  label="Length (ft)"
                  value={boat.lengthFt?.toString()}
                />
                <DataListItemComponent
                  label="Beam (ft)"
                  value={boat.beamFt?.toString()}
                />
                <DataListItemComponent
                  label="Sail Number"
                  value={boat.sailNumber}
                />
                <DataListItemComponent
                  label="Home Port"
                  value={boat.homePort}
                />
                <DataListItemComponent label="Owner" value={boat.owner} />
                <DataListItemComponent label="Notes" value={boat.notes} />
              </DataList.Root>
            </Card.Body>
          </Card.Root>
          <GridItem colSpan={2}>
            <Card.Root>
              <Card.Header>
                <Text>Activities</Text>
              </Card.Header>
              <Card.Body>
                {activities.length === 0 ? (
                  <Center>
                    <Text fontSize="lg">
                      No activities found.{" "}
                      <Link href={`/activities/new?boatId=${boat.id}`}>
                        Create your first activity!
                      </Link>
                    </Text>
                  </Center>
                ) : (
                  <Table.Root>
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader>Date</Table.ColumnHeader>
                        <Table.ColumnHeader>Duration</Table.ColumnHeader>
                        <Table.ColumnHeader>Purpose</Table.ColumnHeader>
                        <Table.ColumnHeader>Distance (NM)</Table.ColumnHeader>
                        <Table.ColumnHeader>Avg Speed (kts)</Table.ColumnHeader>
                        <Table.ColumnHeader>Wind (kts)</Table.ColumnHeader>
                        <Table.ColumnHeader></Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {activities.map((activity) => (
                        <Table.Row key={activity.id}>
                          <Table.Cell>
                            <Text>{formatDate(activity.startTime)}</Text>
                          </Table.Cell>
                          <Table.Cell>
                            <Text>
                              {calculateDuration(
                                activity.startTime,
                                activity.endTime
                              )}
                            </Text>
                          </Table.Cell>
                          <Table.Cell>
                            <Text>{activity.purpose || "-"}</Text>
                          </Table.Cell>
                          <Table.Cell>
                            <Text>{activity.distanceNm || "-"}</Text>
                          </Table.Cell>
                          <Table.Cell>
                            <Text>{activity.avgSpeedKnots || "-"}</Text>
                          </Table.Cell>
                          <Table.Cell>
                            <Text>{activity.windSpeedKnots || "-"}</Text>
                          </Table.Cell>
                          <Table.Cell>
                            <Flex gap="2" justifyContent="end">
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/activities/${activity.id}/edit`}>
                                  Edit
                                </Link>
                              </Button>
                              <Button size="sm" variant="surface" asChild>
                                <Link href={`/activities/${activity.id}`}>
                                  View
                                </Link>
                              </Button>
                            </Flex>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                )}
              </Card.Body>
            </Card.Root>
          </GridItem>
        </SimpleGrid>
      </div>
    </main>
  );
}

interface DataListItemProps {
  label: string;
  value: string | undefined | null;
}

export const DataListItemComponent: React.FC<DataListItemProps> = ({
  label,
  value,
}) => {
  if (!value) return null;
  return (
    <DataList.Item>
      <DataList.ItemLabel>{label}</DataList.ItemLabel>
      <DataList.ItemValue>{value}</DataList.ItemValue>
    </DataList.Item>
  );
};
