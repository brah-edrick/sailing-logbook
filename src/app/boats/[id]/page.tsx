import { Box, Button, Flex, Stack, Text, Grid, Tabs } from "@chakra-ui/react";
import { LuCalendar, LuShip } from "react-icons/lu";
import Link from "next/link";
import { formatDisplayValue, getFieldUnit } from "@/utils/date";
import { notFound } from "next/navigation";
import { SafeDeleteEntityButton } from "@/components/safeDeleteEntityButton";
import {
  ApiBoat,
  PaginatedBoatActivitiesResponse,
  ApiBoatReport,
} from "@/types/api";
import { BoatSummaryCard } from "@/components/boatSummaryCard";
import { BoatActivitiesTable } from "@/components/boatActivitiesTable";
import { Card } from "@/components/card";

export default async function BoatDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const searchParamsData = await searchParams;
  const numericId = Number(id);

  if (isNaN(numericId)) {
    notFound();
  }

  const page = searchParamsData.page ? Number(searchParamsData.page) : 1;
  const limit = searchParamsData.limit ? Number(searchParamsData.limit) : 10;
  const sortBy = searchParamsData.sortBy as string | undefined;
  const sortOrder = searchParamsData.sortOrder as "asc" | "desc" | undefined;

  // Build query string for activities API call
  const activitiesQueryParams = new URLSearchParams();
  activitiesQueryParams.set("page", page.toString());
  activitiesQueryParams.set("limit", limit.toString());
  if (sortBy) activitiesQueryParams.set("sortBy", sortBy);
  if (sortOrder) activitiesQueryParams.set("sortOrder", sortOrder);

  const [boatResponse, activitiesResponse, reportResponse] = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/boats/${id}`,
      {
        cache: "no-store",
      }
    ),
    fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/boats/${id}/activities?${activitiesQueryParams.toString()}`,
      {
        cache: "no-store",
      }
    ),
    fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/boats/${id}/reports`,
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

  if (!reportResponse.ok) {
    throw new Error("Failed to fetch boat report");
  }

  const [boat, activitiesData, report] = await Promise.all([
    boatResponse.json() as Promise<ApiBoat>,
    activitiesResponse.json() as Promise<PaginatedBoatActivitiesResponse>,
    reportResponse.json() as Promise<ApiBoatReport>,
  ]);

  return (
    <Stack direction="column" gap="4" mt="4">
      {/* Header Section */}
      <Box>
        <Flex justifyContent="space-between" alignItems="flex-start" mb="4">
          <Box>
            <Flex alignItems="center" gap="2" mb="2">
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
          <Stack direction="column" gap="4" mt="4">
            {/* Boat Summary Card */}
            <BoatSummaryCard report={report} />

            <Card>
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

              <BoatActivitiesTable
                data={activitiesData}
                boatId={boat.id.toString()}
              />
            </Card>
          </Stack>
        </Tabs.Content>

        <Tabs.Content value="details">
          <Stack direction="column" gap="4" mt="4">
            {/* Essential Information */}
            <Card>
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
            </Card>

            {/* Dimensions & Specifications */}
            <Card>
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
                  label="Length"
                  value={boat.lengthFt?.toString()}
                  fieldName="lengthFt"
                />
                <DataField
                  label="Beam"
                  value={boat.beamFt?.toString()}
                  fieldName="beamFt"
                />
              </Grid>
            </Card>

            {/* Additional Details */}
            <Card>
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
            </Card>
          </Stack>
        </Tabs.Content>
      </Tabs.Root>
    </Stack>
  );
}

interface DataFieldProps {
  label: string;
  value: string | undefined | null;
  fieldName?: string;
}

const DataField: React.FC<DataFieldProps> = ({ label, value, fieldName }) => {
  if (!value) return null;
  const unit = getFieldUnit(fieldName);
  return (
    <Box>
      <Text fontSize="sm" color="fg.muted" mb="1">
        {label}
      </Text>
      <Text fontSize="md" fontWeight="medium">
        {formatDisplayValue(value, fieldName)}
        {unit && (
          <Text as="span" color="fg.muted" ml="1">
            {unit}
          </Text>
        )}
      </Text>
    </Box>
  );
};
