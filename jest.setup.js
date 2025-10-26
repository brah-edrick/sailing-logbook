// Global test setup
// Ensure we're in test environment
if (process.env.NODE_ENV !== "test") {
  throw new Error(
    "Tests should only run in test environment. Set NODE_ENV=test"
  );
}

// Import jest-dom matchers
require("@testing-library/jest-dom");

// Polyfills for Node.js environment
global.structuredClone =
  global.structuredClone ||
  ((obj) => {
    if (obj === undefined) return undefined;
    return JSON.parse(JSON.stringify(obj));
  });
global.setImmediate = global.setImmediate || ((fn) => setTimeout(fn, 0));

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock scrollTo
global.scrollTo = jest.fn();

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  redirect: jest.fn(),
  notFound: jest.fn(),
}));

// Mock next/link
jest.mock("next/link", () => {
  return function MockLink({ children, href, ...props }) {
    return { type: "a", props: { href, ...props }, children };
  };
});

// Mock global fetch
global.fetch = jest.fn();

// Global Prisma mock to prevent real database access
jest.mock("@/lib/prisma", () => {
  // Create a mock function that throws an error if called
  const createMockFunction = (name) => {
    const mockFn = jest.fn();
    mockFn.mockImplementation(() => {
      throw new Error(
        `Prisma function ${name} was called but not properly mocked in test. This indicates a missing mock setup.`
      );
    });
    return mockFn;
  };

  return {
    prisma: {
      sailingActivity: {
        findMany: createMockFunction("sailingActivity.findMany"),
        findUnique: createMockFunction("sailingActivity.findUnique"),
        create: createMockFunction("sailingActivity.create"),
        update: createMockFunction("sailingActivity.update"),
        delete: createMockFunction("sailingActivity.delete"),
        deleteMany: createMockFunction("sailingActivity.deleteMany"),
        upsert: createMockFunction("sailingActivity.upsert"),
        count: createMockFunction("sailingActivity.count"),
        aggregate: createMockFunction("sailingActivity.aggregate"),
        groupBy: createMockFunction("sailingActivity.groupBy"),
      },
      boat: {
        findMany: createMockFunction("boat.findMany"),
        findUnique: createMockFunction("boat.findUnique"),
        create: createMockFunction("boat.create"),
        update: createMockFunction("boat.update"),
        delete: createMockFunction("boat.delete"),
        deleteMany: createMockFunction("boat.deleteMany"),
        upsert: createMockFunction("boat.upsert"),
        count: createMockFunction("boat.count"),
        aggregate: createMockFunction("boat.aggregate"),
        groupBy: createMockFunction("boat.groupBy"),
      },
      $transaction: createMockFunction("$transaction"),
      $queryRaw: createMockFunction("$queryRaw"),
      $executeRaw: createMockFunction("$executeRaw"),
      $connect: createMockFunction("$connect"),
      $disconnect: createMockFunction("$disconnect"),
    },
  };
});
