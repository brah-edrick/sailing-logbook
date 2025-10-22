import Link from "next/link";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Table,
  Stack,
} from "@chakra-ui/react";
import { ApiBoat } from "@/types/api";
import { formatDisplayValue, getFieldUnit } from "@/utils/date";

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
    <Stack direction="column" gap={{ base: "6", md: "8" }}>
      {/* Header Section */}
      <Box>
        <Flex justifyContent="space-between" gap="4" mb="4">
          <Box>
            <Heading size="3xl" mb="2">
              My Boats
            </Heading>
            <Text color="fg.muted" fontSize="sm">
              Manage your boat fleet and specifications
            </Text>
          </Box>
          <Button variant="surface" colorPalette="green" asChild>
            <Link href="/boats/new">+ Add New Boat</Link>
          </Button>
        </Flex>
      </Box>

      {/* Boats Card */}
      <Box
        bg="bg.muted"
        borderRadius="xl"
        border="1px solid"
        borderColor="border.subtle"
        p={{ base: "6", md: "8" }}
        shadow="sm"
      >
        {boats.length === 0 ? (
          <Box textAlign="center" py="8">
            <Text fontSize="lg" color="fg.muted" mb="4">
              No boats found. Add your first boat!
            </Text>
            <Link href="/boats/new">
              <Button variant="surface" colorPalette="green">
                + Add New Boat
              </Button>
            </Link>
          </Box>
        ) : (
          <Table.Root>
            <Table.Header>
              <Table.Row bg="transparent">
                <Table.ColumnHeader>Name</Table.ColumnHeader>
                <Table.ColumnHeader>Make</Table.ColumnHeader>
                <Table.ColumnHeader>Model</Table.ColumnHeader>
                <Table.ColumnHeader>Year</Table.ColumnHeader>
                <Table.ColumnHeader>Length</Table.ColumnHeader>
                <Table.ColumnHeader></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {boats.map((boat) => (
                <Table.Row key={boat.id} bg="transparent">
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
                    <Text>
                      {boat.lengthFt
                        ? `${formatDisplayValue(boat.lengthFt.toString(), "lengthFt")} ${getFieldUnit("lengthFt")}`
                        : "-"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex gap="2" justifyContent="end">
                      <Button
                        size="sm"
                        variant="outline"
                        colorPalette="orange"
                        asChild
                      >
                        <Link href={`/boats/${boat.id}/edit`}>Edit</Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="surface"
                        colorPalette="blue"
                        asChild
                      >
                        <Link href={`/boats/${boat.id}`}>View</Link>
                      </Button>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </Box>
    </Stack>
  );
}
