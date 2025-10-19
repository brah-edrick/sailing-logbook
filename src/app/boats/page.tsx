import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button, Card, DataList, Flex, For, Heading, SimpleGrid } from "@chakra-ui/react";

export default async function BoatsPage() {
  const boats = await prisma.boat.findMany();

  return (
    <main>
      <Flex justifyContent="space-between" gap="4" py="4">
        <Heading size="3xl" color="white">My Boats</Heading>
        <Button asChild>
          <Link href="/boats/new">+ Add New Boat</Link>
        </Button>
      </Flex>

      <SimpleGrid columns={4} gap="4">
        <For each={boats}>
          {(boat) => (

            <Card.Root size="lg" key={boat.id}>
              <Card.Body gap="2">
                <Card.Title>{boat.name}</Card.Title>
                  <DataList.Root orientation="horizontal">
                    <DataList.Item>
                      <DataList.ItemLabel>Make</DataList.ItemLabel>
                      <DataList.ItemValue>{boat.make}</DataList.ItemValue>
                    </DataList.Item>
                    {boat.model && (
                      <DataList.Item>
                        <DataList.ItemLabel>Model</DataList.ItemLabel>
                        <DataList.ItemValue>{boat.model}</DataList.ItemValue>
                      </DataList.Item>
                    )}
                  </DataList.Root>
              </Card.Body>
              <Card.Footer gap="2" justifyContent="end">
                <Button  asChild>
                  <Link href={`/boats/${boat.id}`}>View</Link>
                </Button>

              </Card.Footer>
            </Card.Root>
          )}
        </For>
      </  SimpleGrid>
    </main>
  );
}
