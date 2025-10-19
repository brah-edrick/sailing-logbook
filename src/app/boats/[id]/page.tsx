import { prisma } from "@/lib/prisma";
import { Card, DataList } from "@chakra-ui/react"
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function BoatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const boat = await prisma.boat.findUnique({
    where: { id: Number(id) },
  });

  if (!boat) return notFound();
  return (
    <main>
      <div>
        <Link href="/boats">
          Back to Boats
        </Link>
      </div>
      <div>
        <header>
          <h1>{boat.name}</h1>
        </header>
        <Card.Root>
          <Card.Body>
            <DataList.Root>
              {renderDataListItem("Type", boat.type)}
              {renderDataListItem("Make", boat.make)}
              {renderDataListItem("Model", boat.model)}
              {renderDataListItem("Year", boat.year?.toString())}
              {renderDataListItem("Length (ft)", boat.lengthFt?.toString())}
              {renderDataListItem("Beam (ft)", boat.beamFt?.toString())}
              {renderDataListItem("Sail Number", boat.sailNumber)}
              {renderDataListItem("Home Port", boat.homePort)}
              {renderDataListItem("Owner", boat.owner)}
              {renderDataListItem("Notes", boat.notes)}
            </DataList.Root>
          </Card.Body>
        </Card.Root>
      </div>
    </main>
  );
}

function renderDataListItem(label: string, value: string | undefined | null) {
  if (!value) return null;
  return (
    <DataList.Item>
      <DataList.ItemLabel>{label}</DataList.ItemLabel>
      <DataList.ItemValue>{value}</DataList.ItemValue>
    </DataList.Item>
  );
}
