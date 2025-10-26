import { Text, Link } from "@chakra-ui/react";
import { NewActivityForm } from "@/components/form/activity";
import { PaginatedBoatsResponse } from "@/types/api";

export default async function NewActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ boatId?: string }>;
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/boats?limit=all`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch boats");
  }

  const boatsResponse = (await response.json()) as PaginatedBoatsResponse;
  const boats = boatsResponse.data;
  const resolvedSearchParams = await searchParams;
  const boatIdFromParams = resolvedSearchParams.boatId;

  return (
    <main>
      <Link href="/activities">
        <Text
          color="blue.500"
          fontSize="sm"
          _hover={{ textDecoration: "underline" }}
        >
          ← Back to Activities
        </Text>
      </Link>
      <NewActivityForm boats={boats} boatIdFromParams={boatIdFromParams} />
    </main>
  );
}
