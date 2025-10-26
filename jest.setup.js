// Global test setup
// Polyfills for Node.js environment
global.structuredClone =
  global.structuredClone || ((obj) => JSON.parse(JSON.stringify(obj)));
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
