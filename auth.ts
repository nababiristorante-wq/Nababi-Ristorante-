import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  providers: [
    Credentials({
      name: "Admin Login",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (
          typeof email !== "string" ||
          typeof password !== "string"
        ) {
          return null;
        }

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
          console.error(
            "ADMIN_EMAIL or ADMIN_PASSWORD is not configured."
          );

          return null;
        }

        if (
          email.trim().toLowerCase() !==
          adminEmail.trim().toLowerCase()
        ) {
          return null;
        }

        if (password !== adminPassword) {
          return null;
        }

        return {
          id: "admin",
          name: "Nababi Ristorante Admin",
          email: adminEmail,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
});
