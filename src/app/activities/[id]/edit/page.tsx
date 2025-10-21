import { Heading, Text, Link } from "@chakra-ui/react";
import { notFound } from "next/navigation";
import { EditActivityForm } from "./edit-activity-form";

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
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/boats`,
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

  const [activity, boats] = await Promise.all([
    activityResponse.json(),
    boatsResponse.json(),
  ]);

  return (
    <main>
      <Link href={`/activities/${activity.id}`}>
        <Text>Back to Activity</Text>
      </Link>
      <Heading size="3xl" mb="6">
        Edit Activity
      </Heading>
      <EditActivityForm activity={activity} boats={boats} />
    </main>
  );
}
