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
        return { id: "clinician", name: "Clinician", role: "clinician" } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.role = (user as any).role || "clinician";
      }
      return token;
    },
    async session({ session, token }) {
      // @ts-ignore
      session.user = session.user || {};
      // @ts-ignore
      session.user.role = (token as any).role;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
