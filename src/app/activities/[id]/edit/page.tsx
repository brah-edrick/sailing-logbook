import { Text, Link } from "@chakra-ui/react";
import { notFound } from "next/navigation";
import { EditActivityForm } from "@/components/form/activity";
import { PaginatedBoatsResponse } from "@/types/api";

export default async function EditActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);

  if (isNaN(numericId)) {
    notFound();
  }

  const [activityResponse, boatsResponse] = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/activities/${id}`,
      {
        cache: "no-store",
      }
    ),
    fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/boats?limit=all`,
      {
        cache: "no-store",
      }
    ),
  ]);

  if (!activityResponse.ok) {
    if (activityResponse.status === 404) {
      notFound();
    }
    throw new Error("Failed to fetch activity");
  }

  if (!boatsResponse.ok) {
    throw new Error("Failed to fetch boats");
  }

  const [activity, boatsResponseData] = await Promise.all([
    activityResponse.json(),
    boatsResponse.json(),
  ]);

  const boats = (boatsResponseData as PaginatedBoatsResponse).data;

  return (
    <main>
      <Link href={`/activities/${activity.id}`}>
        <Text
          color="blue.500"
          fontSize="sm"
          _hover={{ textDecoration: "underline" }}
        >
          ← Back to Activity
        </Text>
      </Link>
      <EditActivityForm activity={activity} boats={boats} />
    </main>
  );
}
