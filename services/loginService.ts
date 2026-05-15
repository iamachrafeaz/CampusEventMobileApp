import { STATIC_CREDENTIALS } from "@/constants/credentials";
import { UserType } from "@/constants/userType";

type LoginResult = { success: true } | { success: false; error: string };

export const loginService = (
  email: string,
  password: string,
  userType: UserType
): LoginResult => {
  const expected = STATIC_CREDENTIALS[userType];

  if (email !== expected.email)    return { success: false, error: "Invalid email" };
  if (password !== expected.password) return { success: false, error: "Invalid password" };

  return { success: true };
};