"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Box, Button, Card, DataList, Flex, For, Heading, SimpleGrid, Spinner, Center, Text } from "@chakra-ui/react";
import { DataListItemComponent } from "./[id]/page";

export default function BoatsPage() {
  const [boats, setBoats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoats = async () => {
      try {
        const res = await fetch("/api/boats");
        if (res.ok) {
          const boatsData = await res.json();
          setBoats(boatsData);
        } else {
          console.error("Failed to fetch boats");
        }
      } catch (error) {
        console.error("Error fetching boats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoats();
  }, []);

  if (loading) {
    return (
      <main>
        <Center h="50vh">
          <Spinner size="xl" color="white" />
        </Center>
      </main>
    );
  }

  return (
    <main>
      <Flex justifyContent="space-between" gap="4" py="4">
        <Heading size="3xl" color="white">My Boats</Heading>
        <Button variant="surface" asChild>
          <Link href="/boats/new">+ Add New Boat</Link>
        </Button>
      </Flex>

      <SimpleGrid columns={4} gap="4">
        <For each={boats}>
          {(boat) => (
            <Card.Root size="lg" key={boat.id} >
              <Card.Body gap="2">
                <Card.Title>
                  <Flex alignItems="center" gap="1">
                    {boat.name}
                    <Box
                      style={{ backgroundColor: boat.colorHex || '#FFFFFF' }}
                      borderRadius="full"
                      boxSize="16px"
                      ml="2"
                    />
                  </Flex>
                </Card.Title>
                <DataList.Root orientation="horizontal">
                  <DataListItemComponent label="Type" value={boat.make} />
                  {boat.model && (
                    <DataListItemComponent label="Model" value={boat.model} />
                  )}
                </DataList.Root>
              </Card.Body>
              <Card.Footer gap="2">
                <Button variant="outline" asChild >
                  <Link href={`/boats/${boat.id}/edit`}>Edit</Link>
                </Button>
                <Button variant="surface" asChild >
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
