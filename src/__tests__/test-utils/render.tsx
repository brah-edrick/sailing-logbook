import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";

const system = createSystem(defaultConfig);

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const mockSession = {
    user: {
      id: "test-user",
      name: "Test User",
      email: "test@example.com",
    },
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  };

  return (
    <SessionProvider session={mockSession}>
      <ChakraProvider value={system}>{children}</ChakraProvider>
    </SessionProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
