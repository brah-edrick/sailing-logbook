import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    // Additional middleware logic can go here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow public access to view pages
        if (
          pathname === "/" ||
          pathname === "/activities" ||
          pathname === "/boats" ||
          pathname.startsWith("/activities/[id]") ||
          pathname.startsWith("/boats/[id]") ||
          (pathname.startsWith("/api/activities") && req.method === "GET") ||
          (pathname.startsWith("/api/boats") && req.method === "GET") ||
          pathname.startsWith("/api/activities/reports") ||
          pathname.startsWith("/api/boats/[id]/reports") ||
          pathname.startsWith("/api/boats/[id]/activities") ||
          pathname === "/login"
        ) {
          return true;
        }

        // Require authentication for edit/create/delete operations
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/activities/new",
    "/activities/:id/edit",
    "/boats/new",
    "/boats/:id/edit",
    "/api/activities/:path*",
    "/api/boats/:path*",
  ],
};
