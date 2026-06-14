export type UserRole = "admin" | "student";

export type SessionPayload = {
  sub: string;
  email: string;
  role: UserRole;
  name?: string;
  studentId?: string;
};
