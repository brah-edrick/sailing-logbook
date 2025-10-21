import { Heading, Text, Link } from "@chakra-ui/react";
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
        <Text>Back to Activities</Text>
      </Link>
      <Heading size="3xl" mb="6">
        Add New Activity
      </Heading>
      <NewActivityForm boats={boats} boatIdFromParams={boatIdFromParams} />
    </main>
  );
}
