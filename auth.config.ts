import type { NextAuthConfig } from "next-auth";

const authConfig = {
  pages: {
    signIn: "/admin/login",
  },

  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;

      if (pathname === "/admin" || pathname.startsWith("/admin/")) {
        if (pathname === "/admin/login") {
          return true;
        }

        return !!auth?.user;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;

export default authConfig;
