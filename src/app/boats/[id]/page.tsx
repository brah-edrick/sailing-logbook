"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Card, DataList, Flex, Heading, Stack, Text, Spinner, Center, Dialog, Portal, CloseButton, SimpleGrid, GridItem } from "@chakra-ui/react"
import Link from "next/link";
import { toaster } from "@/components/ui/toaster";

export default function BoatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [boat, setBoat] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string>("");

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchBoat = async () => {
      try {
        const res = await fetch(`/api/boats/${id}`);
        if (res.ok) {
          const boatData = await res.json();
          setBoat(boatData);
        } else if (res.status === 404) {
          router.push("/404");
        } else {
          console.error("Failed to fetch boat");
        }
      } catch (error) {
        console.error("Error fetching boat:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoat();
  }, [id, router]);

  if (loading) {
    return (
      <main>
        <Center h="50vh">
          <Spinner size="xl" color="white" />
        </Center>
      </main>
    );
  }

  if (!boat) {
    return (
      <main>
        <Center h="50vh">
          <Text color="white" fontSize="xl">Boat not found</Text>
        </Center>
      </main>
    );
  }

  const handleDelete = async () => {
    const res = await fetch(`/api/boats/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toaster.create({
        title: "Success",
        description: `${boat.name} deleted successfully`,
        type: "success",
      });
      router.push("/boats");
    }
  };



  return (
    <main>
      <div>
        <Link href="/boats">
          <Text color="white">Back to Boats</Text>
        </Link>
      </div>
      <div>
        <header>
          <Flex justifyContent="space-between" py="4">
            <Heading color="white" size="3xl"><Flex alignItems="center" gap="1">
              {boat.name}
              <Box
                style={{ backgroundColor: boat.colorHex || '#FFFFFF' }}
                borderRadius="full"
                boxSize="24px"
                ml="2"
              />
            </Flex></Heading>
            <Stack direction="row" gap="2">
              <Button variant="surface" >+ Add Activity</Button>
              <Button variant="surface" asChild>
                <Link href={`/boats/${boat.id}/edit`}>Edit</Link>
              </Button>
              <Dialog.Root >
                <Dialog.Trigger asChild>
                  <Button variant="surface" color="red.500">Delete</Button>
                </Dialog.Trigger>
                <Portal>
                  <Dialog.Backdrop />
                  <Dialog.Positioner>
                    <Dialog.Content>
                      <Dialog.Header>
                        <Dialog.Title color="white">Dialog Title</Dialog.Title>
                      </Dialog.Header>
                      <Dialog.Body>
                        <Text color="white">
                          Are you sure you want to delete {boat.name}?
                        </Text>
                      </Dialog.Body>
                      <Dialog.Footer>
                        <Dialog.ActionTrigger asChild>
                          <Button variant="outline">Cancel</Button>
                        </Dialog.ActionTrigger>
                        <Dialog.ActionTrigger asChild>
                          <Button onClick={handleDelete} variant="surface" color="red.500">Confirm Delete {boat.name}</Button>
                        </Dialog.ActionTrigger>
                      </Dialog.Footer>
                      <Dialog.CloseTrigger asChild>
                        <CloseButton size="sm" />
                      </Dialog.CloseTrigger>
                    </Dialog.Content>
                  </Dialog.Positioner>
                </Portal>
              </Dialog.Root>

            </Stack>
          </Flex>
        </header>
        <SimpleGrid columns={3} gap={4}>
          <Card.Root>
            <Card.Header>
              <Text color="white">Details</Text>
            </Card.Header>
            <Card.Body>
              <DataList.Root orientation="horizontal">
                <DataListItemComponent label="Type" value={boat.type} />
                <DataListItemComponent label="Make" value={boat.make} />
                <DataListItemComponent label="Model" value={boat.model} />
                <DataListItemComponent label="Year" value={boat.year?.toString()} />
                <DataListItemComponent label="Length (ft)" value={boat.lengthFt?.toString()} />
                <DataListItemComponent label="Beam (ft)" value={boat.beamFt?.toString()} />
                <DataListItemComponent label="Sail Number" value={boat.sailNumber} />
                <DataListItemComponent label="Home Port" value={boat.homePort} />
                <DataListItemComponent label="Owner" value={boat.owner} />
                <DataListItemComponent label="Notes" value={boat.notes} />
              </DataList.Root>
            </Card.Body>
          </Card.Root>
          <GridItem colSpan={2}>
            <Card.Root >
              <Card.Header>
                <Text color="white">Activities</Text>
              </Card.Header>
              <Card.Body>

              </Card.Body>
            </Card.Root>
          </GridItem>
        </SimpleGrid>
      </div>
    </main>
  );
}

interface DataListItemProps {
  label: string;
  value: string | undefined | null;
}

export const DataListItemComponent: React.FC<DataListItemProps> = ({ label, value }) => {
  if (!value) return null;
  return (
    <DataList.Item>
      <DataList.ItemLabel>{label}</DataList.ItemLabel>
      <DataList.ItemValue>{value}</DataList.ItemValue>
    </DataList.Item>
  );
};
