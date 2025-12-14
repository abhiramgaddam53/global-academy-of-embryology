import { getUserFromToken } from "./getUserFromToken";

export async function verifyAdmin( ) {
  const user = await getUserFromToken();

  if (!user) return null;
  if (user.role !== "admin") return null;

  return user;
}
