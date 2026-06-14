import { connectDb } from "@/lib/db/mongoose";
import { ResearchPaper } from "@/lib/models/ResearchPaper";

export type ResearchPaperStudent = {
  id: string;
  name?: string;
  studentId?: string;
  slug?: string;
  email: string;
  designation?: string;
  avatarUrl?: string;
};

export type ResearchPaperItem = {
  id: string;
  title: string;
  authors: string;
  year?: number;
  venue?: string;
  url?: string;
  description?: string;
  thumbnailUrl?: string;
  studentIds: string[];
  students: ResearchPaperStudent[];
  createdAt: string;
  updatedAt: string;
};

type PopulatedStudent = {
  _id: { toString(): string };
  name?: string | null;
  studentId?: string | null;
  slug?: string | null;
  email?: string;
  isActive?: boolean;
  role?: string;
  profile?: {
    designation?: string | null;
    avatarUrl?: string | null;
  } | null;
};

type PaperDoc = {
  _id: { toString(): string };
  title: string;
  year?: number | null;
  venue?: string | null;
  url?: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  students?: Array<{ toString(): string } | PopulatedStudent>;
  createdAt: Date;
  updatedAt: Date;
};

function isPopulatedStudent(
  student: { toString(): string } | PopulatedStudent,
): student is PopulatedStudent {
  return "email" in student || "name" in student || "profile" in student;
}

function isActivePublicStudent(student: PopulatedStudent) {
  return student.role === "student" && student.isActive !== false;
}

function mapStudentRef(student: { toString(): string } | PopulatedStudent): ResearchPaperStudent | null {
  if (!isPopulatedStudent(student)) {
    return { id: student.toString(), email: "" };
  }

  if (!isActivePublicStudent(student)) {
    return null;
  }

  return {
    id: student._id.toString(),
    name: student.name ?? undefined,
    studentId: student.studentId ?? undefined,
    slug: student.slug ?? undefined,
    email: student.email ?? "",
    designation: student.profile?.designation ?? undefined,
    avatarUrl: student.profile?.avatarUrl ?? undefined,
  };
}

export function studentDisplayName(student: Pick<ResearchPaperStudent, "name" | "studentId" | "email">) {
  return student.name ?? student.studentId ?? student.email;
}

export function formatPaperAuthors(students: ResearchPaperStudent[]) {
  return students.map(studentDisplayName).filter(Boolean).join(", ");
}

function mapStudentRefAdmin(student: { toString(): string } | PopulatedStudent): ResearchPaperStudent | null {
  if (!isPopulatedStudent(student)) {
    return { id: student.toString(), email: "" };
  }

  return {
    id: student._id.toString(),
    name: student.name ?? undefined,
    studentId: student.studentId ?? undefined,
    slug: student.slug ?? undefined,
    email: student.email ?? "",
    designation: student.profile?.designation ?? undefined,
    avatarUrl: student.profile?.avatarUrl ?? undefined,
  };
}

export function serializeResearchPaper(
  paper: PaperDoc,
  options?: { publicOnly?: boolean },
): ResearchPaperItem {
  const mapper = options?.publicOnly ? mapStudentRef : mapStudentRefAdmin;
  const students = (paper.students ?? [])
    .map(mapper)
    .filter((student): student is ResearchPaperStudent => student !== null);

  return {
    id: paper._id.toString(),
    title: paper.title,
    authors: students.length > 0 ? formatPaperAuthors(students) : "",
    year: paper.year ?? undefined,
    venue: paper.venue ?? undefined,
    url: paper.url ?? undefined,
    description: paper.description ?? undefined,
    thumbnailUrl: paper.thumbnailUrl ?? undefined,
    studentIds: students.map((student) => student.id),
    students,
    createdAt: paper.createdAt.toISOString(),
    updatedAt: paper.updatedAt.toISOString(),
  };
}

const studentPopulateFields = "name studentId slug email isActive role profile.designation profile.avatarUrl";

export async function getResearchPapersForStudent(studentId: string) {
  await connectDb();
  const papers = await ResearchPaper.find({ students: studentId })
    .sort({ year: -1, createdAt: -1 })
    .populate("students", studentPopulateFields)
    .lean();

  return papers.map((paper) => serializeResearchPaper(paper));
}

export async function getPublicResearchPapers() {
  await connectDb();
  const papers = await ResearchPaper.find()
    .sort({ year: -1, createdAt: -1 })
    .populate("students", studentPopulateFields)
    .lean();

  return papers
    .map((paper) => serializeResearchPaper(paper, { publicOnly: true }))
    .filter((paper) => paper.students.length > 0);
}

export async function getAllResearchPapers() {
  await connectDb();
  const papers = await ResearchPaper.find()
    .sort({ year: -1, createdAt: -1 })
    .populate("students", studentPopulateFields)
    .lean();

  return papers.map((paper) => serializeResearchPaper(paper));
}
