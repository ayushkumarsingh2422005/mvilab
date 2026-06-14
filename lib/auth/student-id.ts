import { User } from "@/lib/models/User";

export async function generateStudentId() {
  const year = new Date().getFullYear();
  const prefix = `MVI${year}`;

  const latest = await User.findOne({
    role: "student",
    studentId: { $regex: `^${prefix}` },
  })
    .sort({ studentId: -1 })
    .select("studentId")
    .lean();

  if (!latest?.studentId) {
    return `${prefix}0001`;
  }

  const sequence = Number.parseInt(latest.studentId.slice(prefix.length), 10);
  const next = Number.isFinite(sequence) ? sequence + 1 : 1;
  return `${prefix}${String(next).padStart(4, "0")}`;
}
