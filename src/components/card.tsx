import { Card as ChakraCard } from "@chakra-ui/react";

interface CardProps
  extends Omit<
    ChakraCard.RootProps,
    "bg" | "borderRadius" | "border" | "borderColor" | "shadow"
  > {
  children: React.ReactNode;
}

export function Card({ children, ...props }: CardProps) {
  return (
    <ChakraCard.Root
      bg="bg.subtle"
      borderRadius="md"
      border="1px solid"
      borderColor="border.muted"
      {...props}
    >
      <ChakraCard.Body p={{ base: "6", md: "8" }}>{children}</ChakraCard.Body>
    </ChakraCard.Root>
  );
}
