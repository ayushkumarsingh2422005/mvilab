import { MemberDirectory } from "@/components/site/MemberDirectory";
import { listPublicStudents } from "@/lib/public-students";

export const metadata = {
  title: "Member — MVI Lab",
  description: "Meet the students and researchers at MVI Lab.",
};

export default async function MemberPage() {
  const students = await listPublicStudents();
  return <MemberDirectory students={students} />;
}
