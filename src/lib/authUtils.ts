import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getAuthSession() {
  return await getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getAuthSession();
  if (!session) {
    throw new Error("Authentication required");
  }
  return session;
}
