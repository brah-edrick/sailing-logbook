"use client";

import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Box, Flex, Heading, Link, Stack, Button } from "@chakra-ui/react";

export function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/activities" });
  };

  return (
    <Box
      py="4"
      borderBottom="1px solid"
      borderColor="border.subtle"
      bg="bg.muted"
      borderRadius="md"
      px="6"
      mb="8"
      mx="-50vw"
      position="sticky"
      top="0"
      zIndex="10"
      shadow="xs"
    >
      <Box maxW="4xl" mx="auto" px="8">
        <Flex alignItems="center" gap="2" justifyContent="space-between">
          <Heading size="xl">⛵ Brandon&apos;s Sailing Log</Heading>
          <Flex alignItems="center" gap="4">
            <Stack direction="row" gap="4">
              <Link
                href="/boats"
                color={pathname.startsWith("/boats") ? "blue.500" : "fg.muted"}
                fontWeight={
                  pathname.startsWith("/boats") ? "semibold" : "normal"
                }
                _hover={{ color: "blue.500" }}
              >
                Boats
              </Link>
              <Link
                href="/activities"
                color={
                  pathname.startsWith("/activities") ? "blue.500" : "fg.muted"
                }
                fontWeight={
                  pathname.startsWith("/activities") ? "semibold" : "normal"
                }
                _hover={{ color: "blue.500" }}
              >
                Activities
              </Link>
            </Stack>

            {session ? (
              <Button size="sm" variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            ) : (
              <Button size="sm" variant="outline" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            )}
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}
