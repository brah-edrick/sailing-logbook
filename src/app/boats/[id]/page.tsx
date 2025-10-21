import {
  Box,
  Button,
  Card,
  DataList,
  Flex,
  Heading,
  Stack,
  Text,
  Center,
  SimpleGrid,
  GridItem,
  Table,
} from "@chakra-ui/react";
import Link from "next/link";
import { calculateDuration, formatDate } from "@/utils/date";
import { notFound } from "next/navigation";
import { SafeDeleteEntityButton } from "@/components/ui/safe-delete-entity-button";
import { ApiBoat, ApiSailingActivity } from "@/types/api";

export default async function BoatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);

  if (isNaN(numericId)) {
    notFound();
  }

  const [boatResponse, activitiesResponse] = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/boats/${id}`,
      {
        cache: "no-store",
      }
    ),
    fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/boats/${id}/activities`,
      {
        cache: "no-store",
      }
    ),
  ]);

  if (!boatResponse.ok) {
    if (boatResponse.status === 404) {
      notFound();
    }
    throw new Error("Failed to fetch boat");
  }

  if (!activitiesResponse.ok) {
    throw new Error("Failed to fetch boat activities");
  }

  const [boat, activities] = await Promise.all([
    boatResponse.json() as Promise<ApiBoat>,
    activitiesResponse.json() as Promise<ApiSailingActivity[]>,
  ]);

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
              <SafeDeleteEntityButton
                entityId={boat.id}
                entityName={boat.name}
                entityType="boat"
              />
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

                        <Table.ColumnHeader></Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {activities.map((activity: ApiSailingActivity) => (
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
                            <Text>
                              {activity.purpose
                                ? activity.purpose.charAt(0).toUpperCase() +
                                  activity.purpose.slice(1)
                                : "-"}
                            </Text>
                          </Table.Cell>
                          <Table.Cell>
                            <Text>{activity.distanceNm || "-"}</Text>
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

const DataListItemComponent: React.FC<DataListItemProps> = ({
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
