import { Types } from "mongoose";
import { connectDb } from "@/lib/db/mongoose";
import { NewsArticle } from "@/lib/models/NewsArticle";
import { ResearchPaper } from "@/lib/models/ResearchPaper";
import { User } from "@/lib/models/User";

export async function validateStudentAuthorIds(studentIds: string[]) {
  const uniqueIds = [...new Set(studentIds.map((id) => id.trim()).filter(Boolean))];

  if (uniqueIds.length === 0) {
    return { error: "Select at least one student author." as const };
  }

  if (uniqueIds.some((id) => !Types.ObjectId.isValid(id))) {
    return { error: "One or more selected students are invalid." as const };
  }

  await connectDb();

  const students = await User.find({
    _id: { $in: uniqueIds },
    role: "student",
    isActive: true,
  }).select("_id");

  if (students.length !== uniqueIds.length) {
    return {
      error: "One or more selected students were not found or are inactive." as const,
    };
  }

  return {
    studentObjectIds: students.map((student) => student._id),
  };
}

export type StudentDeleteBlockersResult =
  | { ok: true; linkedPaperCount: number }
  | { ok: false; error: string };

export async function getStudentDeleteBlockers(userId: string): Promise<StudentDeleteBlockersResult> {
  await connectDb();

  const linkedPapers = await ResearchPaper.find({ students: userId })
    .select("title students")
    .lean();

  const soleAuthorPapers = linkedPapers.filter((paper) => paper.students?.length === 1);

  if (soleAuthorPapers.length === 0) {
    return { ok: true, linkedPaperCount: linkedPapers.length };
  }

  const titles = soleAuthorPapers
    .map((paper) => paper.title)
    .slice(0, 3)
    .join(", ");

  const suffix =
    soleAuthorPapers.length > 3 ? ` and ${soleAuthorPapers.length - 3} more` : "";

  return {
    ok: false,
    error:
      `Cannot delete this student. They are the only author on: ${titles}${suffix}. ` +
      "Add another student author or delete those papers first.",
  };
}

export async function detachStudentFromResearchPapers(userId: string) {
  await connectDb();

  const result = await ResearchPaper.updateMany(
    { students: userId },
    { $pull: { students: userId } },
  );

  return result.modifiedCount;
}

export async function reassignUserCreatedContent(fromUserId: string, toUserId: string) {
  await connectDb();

  const [papers, newsArticles] = await Promise.all([
    ResearchPaper.updateMany({ createdBy: fromUserId }, { createdBy: toUserId }),
    NewsArticle.updateMany({ createdBy: fromUserId }, { createdBy: toUserId }),
  ]);

  return {
    papersReassigned: papers.modifiedCount,
    newsReassigned: newsArticles.modifiedCount,
  };
}
