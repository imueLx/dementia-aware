import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export async function getClinicianSession(): Promise<Session | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== "clinician") {
    return null;
  }
  return session;
}
