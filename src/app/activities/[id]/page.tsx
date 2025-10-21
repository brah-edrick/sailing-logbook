import {
  Button,
  Card,
  DataList,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SafeDeleteEntityButton } from "@/components/ui/safe-delete-entity-button";
import { ApiSailingActivity } from "@/types/api";
import { formatDateTime, calculateDuration } from "@/utils/date";

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
    <main>
      <div>
        <Link href="/activities">
          <Text>Back to Activities</Text>
        </Link>
      </div>
      <div>
        <header>
          <Flex justifyContent="space-between" py="4">
            <Heading size="3xl">
              Activity - {formatDateTime(activity.startTime)}
            </Heading>
            <Stack direction="row" gap="2">
              <Button variant="surface" asChild>
                <Link href={`/activities/${activity.id}/edit`}>Edit</Link>
              </Button>
              <SafeDeleteEntityButton
                entityId={activity.id}
                entityName={`Activity - ${formatDateTime(activity.startTime)}`}
                entityType="activity"
              />
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
                <DataListItemComponent
                  label="Boat"
                  value={activity.boat?.name}
                />
                <DataListItemComponent
                  label="Purpose"
                  value={activity.purpose}
                />
                <DataListItemComponent
                  label="Start Time"
                  value={formatDateTime(activity.startTime)}
                />
                <DataListItemComponent
                  label="End Time"
                  value={formatDateTime(activity.endTime)}
                />
                <DataListItemComponent
                  label="Duration"
                  value={calculateDuration(
                    activity.startTime,
                    activity.endTime
                  )}
                />
              </DataList.Root>
            </Card.Body>
          </Card.Root>

          <Card.Root>
            <Card.Header>
              <Card.Title>Location & Navigation</Card.Title>
            </Card.Header>
            <Card.Body>
              <DataList.Root orientation="horizontal">
                <DataListItemComponent
                  label="Departure Location"
                  value={activity.departureLocation}
                />
                <DataListItemComponent
                  label="Return Location"
                  value={activity.returnLocation}
                />
                <DataListItemComponent
                  label="Distance (NM)"
                  value={activity.distanceNm?.toString()}
                />
                <DataListItemComponent
                  label="Average Speed (knots)"
                  value={activity.avgSpeedKnots?.toString()}
                />
              </DataList.Root>
            </Card.Body>
          </Card.Root>

          <Card.Root>
            <Card.Header>
              <Card.Title>Weather & Conditions</Card.Title>
            </Card.Header>
            <Card.Body>
              <DataList.Root orientation="horizontal">
                <DataListItemComponent
                  label="Weather Conditions"
                  value={activity.weatherConditions}
                />
                <DataListItemComponent
                  label="Wind Speed (knots)"
                  value={activity.windSpeedKnots?.toString()}
                />
                <DataListItemComponent
                  label="Wind Direction"
                  value={activity.windDirection}
                />
                <DataListItemComponent
                  label="Sea State"
                  value={activity.seaState}
                />
                <DataListItemComponent
                  label="Sail Configuration"
                  value={activity.sailConfiguration}
                />
              </DataList.Root>
            </Card.Body>
          </Card.Root>

          {activity.notes && (
            <Card.Root>
              <Card.Header>
                <Card.Title>Notes</Card.Title>
              </Card.Header>
              <Card.Body>
                <Text>{activity.notes}</Text>
              </Card.Body>
            </Card.Root>
          )}
        </Stack>
      </div>
    </main>
  );
}
