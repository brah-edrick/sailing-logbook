import Link from "next/link";
import { Box, Button, Flex, Heading, Text, Stack } from "@chakra-ui/react";
import { PaginatedBoatsResponse } from "@/types/api";
import { BoatsTable } from "@/components/boatsTable";

export default async function BoatsPage({
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

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/boats?${queryParams.toString()}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch boats");
  }

  const boatsData = (await response.json()) as PaginatedBoatsResponse;

  return (
    <Stack direction="column" gap="4" mt="4">
      {/* Header Section */}
      <Box>
        <Flex justifyContent="space-between" gap="4" mb="4">
          <Box>
            <Heading size="3xl" mb="2">
              My Boats
            </Heading>
            <Text color="fg.muted" fontSize="sm">
              Manage your boat fleet and specifications
            </Text>
          </Box>
          <Button variant="surface" colorPalette="green" asChild>
            <Link href="/boats/new">+ Add New Boat</Link>
          </Button>
        </Flex>
      </Box>

      {/* Boats Table */}
      <BoatsTable data={boatsData} />
    </Stack>
  );
}
