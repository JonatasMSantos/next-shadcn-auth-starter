import { withAuth } from "next-auth/middleware";
import { verifyAuth } from "./lib/jwt";

const authorizedPaths = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/users",
  "/login",
  "/register",
  "/_next",
  "/favicon.ico",
];

export default withAuth({
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    authorized: async ({ req, token }) => {
      console.log("ENTROU");
      if (token) return true;

      const pathname = req.nextUrl.pathname;
      console.log(pathname);

      if (authorizedPaths.some((prefix) => pathname.startsWith(prefix))) {
        return true;
      }

      if (pathname.startsWith("/api/")) {
        const accessToken = req.headers.get("authorization");
        const valid = await verifyAuth(accessToken!);

        if (!accessToken || !(await verifyAuth(accessToken))) {
          return false;
        } else {
          return true;
        }
      }

      if (pathname.startsWith("/_next") || pathname === "/favicon.ico") {
        return true;
      }

      return false;
    },
  },
  pages: { signIn: "/login" },
});
