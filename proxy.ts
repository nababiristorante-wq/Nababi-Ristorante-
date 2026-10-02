import { auth } from "./auth";

export default auth((request) => {
  const { pathname } = request.nextUrl;

  if (
    pathname === "/admin" ||
    (pathname.startsWith("/admin/") &&
      pathname !== "/admin/login")
  ) {
    if (!request.auth?.user) {
      const loginUrl = new URL(
        "/admin/login",
        request.nextUrl.origin
      );

      loginUrl.searchParams.set(
        "callbackUrl",
        pathname
      );

      return Response.redirect(loginUrl);
    }
  }

  return;
});

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
  ],
};
