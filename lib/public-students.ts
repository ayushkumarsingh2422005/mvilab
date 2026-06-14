import { connectDb } from "@/lib/db/mongoose";
import { User } from "@/lib/models/User";
import { getResearchPapersForStudent } from "@/lib/research-papers";
import { serializeStudentProfile, type StudentProfileResponse } from "@/lib/student-profile";
import type { ResearchPaperItem } from "@/lib/research-papers";

export type PublicStudentListItem = {
  id: string;
  name: string;
  slug: string;
  department?: string;
  designation?: string;
  avatarUrl?: string;
  researchInterests?: string;
};

export type PublicStudentProfile = {
  slug: string;
  profile: StudentProfileResponse;
  papers: ResearchPaperItem[];
};

export async function getPublicStudentBySlug(slug: string): Promise<PublicStudentProfile | null> {
  await connectDb();

  const user = await User.findOne({
    role: "student",
    slug: slug.toLowerCase(),
    isActive: true,
  })
    .select("name email studentId slug profile")
    .lean();

  if (!user?.slug) return null;

  const papers = await getResearchPapersForStudent(user._id.toString());

  return {
    slug: user.slug,
    profile: serializeStudentProfile(user),
    papers,
  };
}

export async function listPublicStudents(): Promise<PublicStudentListItem[]> {
  await connectDb();

  const students = await User.find({
    role: "student",
    isActive: true,
    slug: { $exists: true, $nin: [null, ""] },
  })
    .sort({ name: 1 })
    .select("name slug profile.department profile.designation profile.avatarUrl profile.researchInterests")
    .lean();

  return students
    .filter((student) => student.slug)
    .map((student) => ({
      id: student._id.toString(),
      name: student.name ?? student.slug!,
      slug: student.slug!,
      department: student.profile?.department ?? undefined,
      designation: student.profile?.designation ?? undefined,
      avatarUrl: student.profile?.avatarUrl ?? undefined,
      researchInterests: student.profile?.researchInterests ?? undefined,
    }));
}
