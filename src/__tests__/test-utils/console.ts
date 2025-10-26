/**
 * Test utilities for console management
 */

/**
 * Helper function to suppress console.error for error handling tests
 * Returns a restore function that should be called after the test
 */
export const suppressConsoleError = () => {
  const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  return () => consoleSpy.mockRestore();
};
