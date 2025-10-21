import Link from "next/link";
import {
  Box,
  Button,
  Flex,
  Heading,
  Center,
  Text,
  Table,
} from "@chakra-ui/react";
import { ApiSailingActivityWithBoat } from "@/types/api";
import { formatDate, calculateDuration } from "@/utils/date";

export default async function ActivitiesPage() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/activities`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch activities");
  }

  const activities = (await response.json()) as ApiSailingActivityWithBoat[];

  return (
    <main>
      <Flex justifyContent="space-between" gap="4" py="4">
        <Heading size="3xl">Activities</Heading>
        <Button variant="surface" asChild>
          <Link href="/activities/new">+ Add New Activity</Link>
        </Button>
      </Flex>

      {activities.length === 0 ? (
        <Center h="40vh">
          <Text fontSize="lg">
            No activities found. Create your first activity!
          </Text>
        </Center>
      ) : (
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Date</Table.ColumnHeader>
              <Table.ColumnHeader>Boat</Table.ColumnHeader>
              <Table.ColumnHeader>Duration</Table.ColumnHeader>
              <Table.ColumnHeader>Purpose</Table.ColumnHeader>
              <Table.ColumnHeader>Distance (NM)</Table.ColumnHeader>
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
                  <Link href={`/boats/${activity.boatId}`}>
                    <Flex alignItems="center" gap="2">
                      {activity.boat?.colorHex && (
                        <Box
                          style={{ backgroundColor: activity.boat.colorHex }}
                          borderRadius="full"
                          boxSize="12px"
                        />
                      )}
                      <Text>{activity.boat?.name || "Unknown Boat"}</Text>
                    </Flex>
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Text>
                    {calculateDuration(activity.startTime, activity.endTime)}
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
