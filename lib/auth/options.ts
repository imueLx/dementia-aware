import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        token: { label: "Token", type: "password" },
      },
      async authorize(credentials) {
        const token = String(credentials?.token ?? "");
        const expected = process.env.CLINICAL_DASHBOARD_TOKEN ?? "";

        if (!expected) {
          // No server config
          return null;
        }

        if (token !== expected) {
          return null;
        }

        // Return a user object with role
        return { id: "clinician", name: "Clinician", role: "clinician" };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && "role" in user) {
        token.role = user.role as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string | undefined;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/dashboard/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
