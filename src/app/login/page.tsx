"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/card";
import { Box, Button, Input, Stack, Heading, Text } from "@chakra-ui/react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid username or password");
      } else {
        // Check if we're authenticated
        const session = await getSession();
        if (session) {
          router.push("/activities");
        }
      }
    } catch {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card maxW="md" w="full" mx="auto">
      <Box p="8">
        <Stack gap="6">
          <Box textAlign="center">
            <Heading size="xl" mb="2">
              Sailing Log
            </Heading>
            <Text color="fg.muted">Sign in to manage sailing activities</Text>
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack gap="4">
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb="2">
                  Username
                </Text>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  bg="bg.subtle"
                  _focus={{ bg: "bg.muted", borderColor: "blue.500" }}
                  required
                />
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="medium" mb="2">
                  Password
                </Text>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  bg="bg.subtle"
                  _focus={{ bg: "bg.muted", borderColor: "blue.500" }}
                  required
                />
              </Box>

              {error && (
                <Box
                  p="3"
                  bg="red.50"
                  border="1px solid"
                  borderColor="red.200"
                  borderRadius="md"
                >
                  <Text color="red.600" fontSize="sm">
                    {error}
                  </Text>
                </Box>
              )}

              <Button
                type="submit"
                colorPalette="blue"
                variant="surface"
                loading={isLoading}
                loadingText="Signing in..."
                width="full"
              >
                Sign In
              </Button>
            </Stack>
          </form>
        </Stack>
      </Box>
    </Card>
  );
}
