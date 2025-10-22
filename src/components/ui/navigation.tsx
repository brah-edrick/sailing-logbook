"use client";

import { usePathname } from "next/navigation";
import { Box, Flex, Heading, Link, Stack } from "@chakra-ui/react";

export function Navigation() {
  const pathname = usePathname();

  return (
    <Box
      py="4"
      borderBottom="1px solid"
      borderColor="border.subtle"
      bg="bg.muted"
      borderRadius="xl"
      px="6"
      mb="8"
      mx="-6"
    >
      <Flex alignItems="center" gap="2" justifyContent="space-between">
        <Heading size="xl">⛵ Sailing Log</Heading>
        <Stack direction="row" gap="4">
          <Link
            href="/boats"
            color={pathname.startsWith("/boats") ? "blue.500" : "fg.muted"}
            fontWeight={pathname.startsWith("/boats") ? "semibold" : "normal"}
            _hover={{ color: "blue.500" }}
          >
            Boats
          </Link>
          <Link
            href="/activities"
            color={pathname.startsWith("/activities") ? "blue.500" : "fg.muted"}
            fontWeight={
              pathname.startsWith("/activities") ? "semibold" : "normal"
            }
            _hover={{ color: "blue.500" }}
          >
            Activities
          </Link>
        </Stack>
      </Flex>
    </Box>
  );
}
