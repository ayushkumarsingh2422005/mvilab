import { notFound } from "next/navigation";
import { PublicStudentProfilePage } from "@/components/site/PublicStudentProfile";
import { getPublicStudentBySlug } from "@/lib/public-students";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const student = await getPublicStudentBySlug(slug);

  if (!student) {
    return { title: "Student — MVI Lab" };
  }

  return {
    title: `${student.profile.name ?? slug} — MVI Lab`,
    description: student.profile.profile.bio ?? `Student profile at MVI Lab.`,
  };
}

export default async function StudentPublicProfileRoute({ params }: PageProps) {
  const { slug } = await params;
  const student = await getPublicStudentBySlug(slug);

  if (!student) notFound();

  return <PublicStudentProfilePage student={student} />;
}
