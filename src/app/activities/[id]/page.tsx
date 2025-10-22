import { Button, Box, Flex, Stack, Text, Grid } from "@chakra-ui/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SafeDeleteEntityButton } from "@/components/ui/safeDeleteEntityButton";
import { ApiSailingActivity } from "@/types/api";
import { formatDateTime, calculateDuration } from "@/utils/date";

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

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);

  if (isNaN(numericId)) {
    notFound();
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/activities/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }
    throw new Error("Failed to fetch activity");
  }

  const activity = (await response.json()) as ApiSailingActivity;

  return (
    <Stack direction="column" gap={{ base: "6", md: "8" }}>
      {/* Header Section */}
      <Box>
        <Flex justifyContent="space-between" alignItems="flex-start" mb="4">
          <Box>
            <Box
              as="h1"
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="bold"
              mb="2"
            >
              Activity - {formatDateTime(activity.startTime)}
            </Box>
            <Box color="fg.muted" fontSize="sm">
              View your sailing activity details and performance metrics
            </Box>
          </Box>
          <Stack direction="row" gap="2">
            <Button variant="surface" colorPalette="orange" asChild>
              <Link href={`/activities/${activity.id}/edit`}>Edit</Link>
            </Button>
            <SafeDeleteEntityButton
              entityId={activity.id}
              entityName={`Activity - ${formatDateTime(activity.startTime)}`}
              entityType="activity"
            />
          </Stack>
        </Flex>
        <Link href="/activities">
          <Text
            color="blue.500"
            fontSize="sm"
            _hover={{ textDecoration: "underline" }}
          >
            ← Back to Activities
          </Text>
        </Link>
      </Box>

      {/* Basic Information */}
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
            Basic Information
          </Box>
          <Box color="fg.muted" fontSize="sm">
            Essential details about your sailing activity
          </Box>
        </Box>

        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
          gap={{ base: "4", md: "6" }}
        >
          <DataField label="Boat" value={activity.boat?.name} />
          <DataField label="Activity Purpose" value={activity.purpose} />
          <DataField
            label="Start Time"
            value={formatDateTime(activity.startTime)}
          />
          <DataField
            label="End Time"
            value={formatDateTime(activity.endTime)}
          />
          <DataField
            label="Duration"
            value={calculateDuration(activity.startTime, activity.endTime)}
          />
        </Grid>
      </Box>

      {/* Location & Navigation */}
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
            Location & Navigation
          </Box>
          <Box color="fg.muted" fontSize="sm">
            Track your journey and sailing performance
          </Box>
        </Box>

        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
          gap={{ base: "4", md: "6" }}
        >
          <DataField
            label="Departure Location"
            value={activity.departureLocation}
          />
          <DataField label="Return Location" value={activity.returnLocation} />
          <DataField
            label="Distance (NM)"
            value={activity.distanceNm?.toString()}
          />
          <DataField
            label="Average Speed (knots)"
            value={activity.avgSpeedKnots?.toString()}
          />
        </Grid>
      </Box>

      {/* Weather & Conditions */}
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
            Weather & Conditions
          </Box>
          <Box color="fg.muted" fontSize="sm">
            Record the sailing conditions and environmental factors
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
          <DataField label="Weather" value={activity.weatherConditions} />
          <DataField
            label="Wind Speed (knots)"
            value={activity.windSpeedKnots?.toString()}
          />
          <DataField label="Wind Direction" value={activity.windDirection} />
          <DataField label="Sea State" value={activity.seaState} />
          <DataField
            label="Sail Configuration"
            value={activity.sailConfiguration}
          />
        </Grid>
      </Box>

      {/* Additional Notes */}
      {activity.notes && (
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
              Additional Notes
            </Box>
            <Box color="fg.muted" fontSize="sm">
              Record any observations, highlights, or special moments from your
              sail
            </Box>
          </Box>

          <Box>
            <Text fontSize="sm" color="fg.muted" mb="2">
              Notes
            </Text>
            <Text fontSize="md" lineHeight="1.6">
              {activity.notes}
            </Text>
          </Box>
        </Box>
      )}
    </Stack>
  );
}
