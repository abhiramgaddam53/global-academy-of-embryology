import { cookies } from "next/headers";
import { verifyToken } from "./auth";

const COOKIE_NAME = process.env.COOKIE_NAME || "token";

export async function getUserFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;
  const user = verifyToken(token);
  console.log(user)

  return user || null;
}
