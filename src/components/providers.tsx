"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./colorMode";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export function Providers(props: ColorModeProviderProps) {
  return (
    <NextAuthSessionProvider>
      <ChakraProvider value={defaultSystem}>
        <ColorModeProvider {...props} />
      </ChakraProvider>
    </NextAuthSessionProvider>
  );
}
