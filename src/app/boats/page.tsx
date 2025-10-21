import Link from "next/link";
import { Box, Button, Flex, Heading, Text, Table } from "@chakra-ui/react";
import { ApiBoat } from "@/types/api";

export default async function BoatsPage() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/boats`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch boats");
  }

  const boats = (await response.json()) as ApiBoat[];

  return (
    <main>
      <Flex justifyContent="space-between" gap="4" py="4">
        <Heading size="3xl">My Boats</Heading>
        <Button variant="surface" asChild>
          <Link href="/boats/new">+ Add New Boat</Link>
        </Button>
      </Flex>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Make</Table.ColumnHeader>
            <Table.ColumnHeader>Model</Table.ColumnHeader>
            <Table.ColumnHeader>Year</Table.ColumnHeader>
            <Table.ColumnHeader>Length (ft)</Table.ColumnHeader>
            <Table.ColumnHeader></Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {boats.map((boat) => (
            <Table.Row key={boat.id}>
              <Table.Cell>
                <Flex alignItems="center" gap="2">
                  <Box
                    style={{ backgroundColor: boat.colorHex || "#FFFFFF" }}
                    borderRadius="full"
                    boxSize="12px"
                  />
                  <Text>{boat.name}</Text>
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <Text>{boat.make || "-"}</Text>
              </Table.Cell>
              <Table.Cell>
                <Text>{boat.model || "-"}</Text>
              </Table.Cell>
              <Table.Cell>
                <Text>{boat.year || "-"}</Text>
              </Table.Cell>
              <Table.Cell>
                <Text>{boat.lengthFt || "-"}</Text>
              </Table.Cell>
              <Table.Cell>
                <Flex gap="2" justifyContent="end">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/boats/${boat.id}/edit`}>Edit</Link>
                  </Button>
                  <Button size="sm" variant="surface" asChild>
                    <Link href={`/boats/${boat.id}`}>View</Link>
                  </Button>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </main>
  );
}
