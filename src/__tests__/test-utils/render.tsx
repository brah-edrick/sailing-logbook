import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";

const system = createSystem(defaultConfig);

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
