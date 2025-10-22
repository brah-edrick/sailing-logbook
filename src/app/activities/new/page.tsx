import { Text, Link } from "@chakra-ui/react";
import { NewActivityForm } from "@/components/form/activity";

export default async function NewActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ boatId?: string }>;
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/boats`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch boats");
  }

  const boats = await response.json();
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
