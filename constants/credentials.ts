import { UserType } from "@/types/UserType";

export const STATIC_CREDENTIALS: Record<UserType, { email: string; password: string }> = {
  ADMIN:   { email: "admin@campus.ma",    password: "admin123"    },
  STUDENT: { email: "etudiant@campus.ma", password: "etudiant123" },
};