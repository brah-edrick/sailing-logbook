import {
  Box,
  Button,
  Flex,
  Stack,
  Text,
  Grid,
  Table,
  Tabs,
} from "@chakra-ui/react";
import { LuCalendar, LuShip } from "react-icons/lu";
import Link from "next/link";
import { calculateDuration, formatDate } from "@/utils/date";
import { notFound } from "next/navigation";
import { SafeDeleteEntityButton } from "@/components/ui/safeDeleteEntityButton";
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
    <Stack direction="column" gap={{ base: "6", md: "8" }}>
      {/* Header Section */}
      <Box>
        <Flex justifyContent="space-between" alignItems="flex-start" mb="4">
          <Box>
            <Flex alignItems="baseline" gap="2" mb="2">
              <Box
                as="h1"
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="bold"
              >
                {boat.name}
              </Box>
              <Box
                style={{ backgroundColor: boat.colorHex || "#FFFFFF" }}
                borderRadius="full"
                boxSize="24px"
              />
            </Flex>
            <Box color="fg.muted" fontSize="sm">
              View your boat details and sailing activities
            </Box>
          </Box>
          <Stack direction="row" gap="2">
            <Link href={`/activities/new?boatId=${boat.id}`}>
              <Button variant="surface" colorPalette="green">
                + Add New Activity
              </Button>
            </Link>
            <Button variant="surface" colorPalette="orange" asChild>
              <Link href={`/boats/${boat.id}/edit`}>Edit</Link>
            </Button>
            <SafeDeleteEntityButton
              entityId={boat.id}
              entityName={boat.name}
              entityType="boat"
            />
          </Stack>
        </Flex>
        <Link href="/boats">
          <Text
            color="blue.500"
            fontSize="sm"
            _hover={{ textDecoration: "underline" }}
          >
            ← Back to Boats
          </Text>
        </Link>
      </Box>

      {/* Tabs Section */}
      <Tabs.Root defaultValue="activities" variant="enclosed">
        <Tabs.List>
          <Tabs.Trigger value="activities">
            <Flex alignItems="center" gap="2">
              <LuCalendar size="16" />
              Activities
            </Flex>
          </Tabs.Trigger>
          <Tabs.Trigger value="details">
            <Flex alignItems="center" gap="2">
              <LuShip size="16" />
              Boat Details
            </Flex>
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="activities">
          <Box
            bg="bg.muted"
            borderRadius="xl"
            border="1px solid"
            borderColor="border.subtle"
            p={{ base: "6", md: "8" }}
            shadow="sm"
            mt="4"
          >
            <Box mb="6">
              <Flex
                justifyContent="space-between"
                alignItems="flex-start"
                mb="2"
              >
                <Box>
                  <Box
                    as="h2"
                    fontSize="xl"
                    fontWeight="semibold"
                    mb="2"
                    color="fg.emphasized"
                  >
                    Sailing Activities
                  </Box>
                  <Box color="fg.muted" fontSize="sm">
                    Track your sailing adventures with this boat
                  </Box>
                </Box>
                <Link href={`/activities/new?boatId=${boat.id}`}>
                  <Button variant="surface" size="sm" colorPalette="green">
                    + Add New Activity
                  </Button>
                </Link>
              </Flex>
            </Box>

            {activities.length === 0 ? (
              <Box textAlign="center" py="8">
                <Text fontSize="lg" color="fg.muted" mb="4">
                  No activities found.
                </Text>
                <Link href={`/activities/new?boatId=${boat.id}`}>
                  <Button variant="surface" colorPalette="green">
                    Create your first activity!
                  </Button>
                </Link>
              </Box>
            ) : (
              <Table.Root>
                <Table.Header>
                  <Table.Row bg="transparent">
                    <Table.ColumnHeader>Date</Table.ColumnHeader>
                    <Table.ColumnHeader>Duration</Table.ColumnHeader>
                    <Table.ColumnHeader>Purpose</Table.ColumnHeader>
                    <Table.ColumnHeader>Distance (NM)</Table.ColumnHeader>
                    <Table.ColumnHeader></Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {activities.map((activity: ApiSailingActivity) => (
                    <Table.Row key={activity.id} bg="transparent">
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
                          <Button
                            size="sm"
                            variant="outline"
                            colorPalette="orange"
                            asChild
                          >
                            <Link href={`/activities/${activity.id}/edit`}>
                              Edit
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="surface"
                            colorPalette="blue"
                            asChild
                          >
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
          </Box>
        </Tabs.Content>

        <Tabs.Content value="details">
          <Stack direction="column" gap={{ base: "6", md: "8" }} mt="4">
            {/* Essential Information */}
            <Box
              bg="bg.muted"
              borderRadius="xl"
              border="1px solid"
              borderColor="border.subtle"
              p={{ base: "6", md: "8" }}
              shadow="sm"
            >
              <Box mb="6">
                <Box
                  as="h2"
                  fontSize="xl"
                  fontWeight="semibold"
                  mb="2"
                  color="fg.emphasized"
                >
                  Essential Information
                </Box>
                <Box color="fg.muted" fontSize="sm">
                  Basic details required to identify your boat
                </Box>
              </Box>

              <Grid
                templateColumns={{
                  base: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                }}
                gap={{ base: "4", md: "6" }}
              >
                <DataField label="Boat Name" value={boat.name} />
                <DataField label="Make" value={boat.make} />
                <DataField label="Model" value={boat.model} />
                <DataField label="Type" value={boat.type} />
                <DataField label="Year" value={boat.year?.toString()} />
                <DataField label="Sail Number" value={boat.sailNumber} />
              </Grid>
            </Box>

            {/* Dimensions & Specifications */}
            <Box
              bg="bg.muted"
              borderRadius="xl"
              border="1px solid"
              borderColor="border.subtle"
              p={{ base: "6", md: "8" }}
              shadow="sm"
            >
              <Box mb="6">
                <Box
                  as="h2"
                  fontSize="xl"
                  fontWeight="semibold"
                  mb="2"
                  color="fg.emphasized"
                >
                  Dimensions & Specifications
                </Box>
                <Box color="fg.muted" fontSize="sm">
                  Physical measurements and technical details
                </Box>
              </Box>

              <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={{ base: "4", md: "6" }}
              >
                <DataField
                  label="Length (ft)"
                  value={boat.lengthFt?.toString()}
                />
                <DataField label="Beam (ft)" value={boat.beamFt?.toString()} />
              </Grid>
            </Box>

            {/* Additional Details */}
            <Box
              bg="bg.muted"
              borderRadius="xl"
              border="1px solid"
              borderColor="border.subtle"
              p={{ base: "6", md: "8" }}
              shadow="sm"
            >
              <Box mb="6">
                <Box
                  as="h2"
                  fontSize="xl"
                  fontWeight="semibold"
                  mb="2"
                  color="fg.emphasized"
                >
                  Additional Details
                </Box>
                <Box color="fg.muted" fontSize="sm">
                  Optional information to complete your boat profile
                </Box>
              </Box>

              <Stack gap={{ base: "4", md: "6" }}>
                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={{ base: "4", md: "6" }}
                >
                  <DataField label="Home Port" value={boat.homePort} />
                  <DataField label="Owner" value={boat.owner} />
                </Grid>

                {boat.notes && (
                  <Box>
                    <Text fontSize="sm" color="fg.muted" mb="2">
                      Notes
                    </Text>
                    <Text fontSize="md" lineHeight="1.6">
                      {boat.notes}
                    </Text>
                  </Box>
                )}
              </Stack>
            </Box>
          </Stack>
        </Tabs.Content>
      </Tabs.Root>
    </Stack>
  );
}

interface DataFieldProps {
  label: string;
  value: string | undefined | null;
}

const DataField: React.FC<DataFieldProps> = ({ label, value }) => {
  if (!value) return null;
  return (
    <Box>
      <Text fontSize="sm" color="fg.muted" mb="1">
        {label}
      </Text>
      <Text fontSize="md" fontWeight="medium">
        {value}
      </Text>
    </Box>
  );
};
