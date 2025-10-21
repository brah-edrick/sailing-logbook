import { Heading, Text, Link } from "@chakra-ui/react";
import { notFound } from "next/navigation";
import { EditBoatForm } from "@/components/form/boat";

export default async function EditBoatPage({
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
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/boats/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }
    throw new Error("Failed to fetch boat");
  }

  const boat = await response.json();

  return (
    <main>
      <Link href={`/boats/${boat.id}`}>
        <Text>Back to {boat.name}</Text>
      </Link>
      <Heading size="3xl" mb="6">
        Edit {boat.name}
      </Heading>
      <EditBoatForm boat={boat} />
    </main>
  );
}
