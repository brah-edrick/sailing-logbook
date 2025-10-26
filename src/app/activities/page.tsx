import Link from "next/link";
import { Box, Button, Flex, Heading, Text, Stack } from "@chakra-ui/react";
import { PaginatedActivitiesResponse, ApiActivitiesReport } from "@/types/api";
import { ActivitiesSummaryCard } from "@/components/activitiesSummaryCard";
import { ActivitiesTable } from "@/components/activitiesTable";

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;
  const limit = params.limit ? Number(params.limit) : 10;
  const sortBy = params.sortBy as string | undefined;
  const sortOrder = params.sortOrder as "asc" | "desc" | undefined;

  // Build query string for API call
  const queryParams = new URLSearchParams();
  queryParams.set("page", page.toString());
  queryParams.set("limit", limit.toString());
  if (sortBy) queryParams.set("sortBy", sortBy);
  if (sortOrder) queryParams.set("sortOrder", sortOrder);

  const [activitiesResponse, reportResponse] = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/activities?${queryParams.toString()}`,
      {
        cache: "no-store",
      }
    ),
    fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/activities/reports`,
      {
        cache: "no-store",
      }
    ),
  ]);

  if (!activitiesResponse.ok) {
    throw new Error("Failed to fetch activities");
  }

  if (!reportResponse.ok) {
    throw new Error("Failed to fetch report");
  }

  const [activitiesData, report] = await Promise.all([
    activitiesResponse.json() as Promise<PaginatedActivitiesResponse>,
    reportResponse.json() as Promise<ApiActivitiesReport>,
  ]);

  return (
    <Stack direction="column" gap="4" mt="4">
      {/* Header Section */}
      <Box>
        <Flex justifyContent="space-between" gap="4" mb="4">
          <Box>
            <Heading size="3xl" mb="2">
              Activities
            </Heading>
            <Text color="fg.muted" fontSize="sm">
              Track and manage your sailing activities
            </Text>
          </Box>
          <Button variant="surface" colorPalette="green" asChild>
            <Link href="/activities/new">+ Add New Activity</Link>
          </Button>
        </Flex>
      </Box>

      {/* Summary Card */}
      <ActivitiesSummaryCard report={report} />

      {/* Activities Table */}
      <ActivitiesTable data={activitiesData} />
    </Stack>
  );
}
