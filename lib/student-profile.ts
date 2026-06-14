export type SocialLinks = {
  linkedin?: string;
  twitter?: string;
  github?: string;
  googleScholar?: string;
  orcid?: string;
  researchGate?: string;
};

export type StudentProfileData = {
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  designation?: string;
  department?: string;
  researchInterests?: string;
  website?: string;
  socialLinks: SocialLinks;
};

export type StudentProfileResponse = {
  id: string;
  studentId?: string;
  name?: string;
  email: string;
  profile: StudentProfileData;
  updatedAt?: string;
};

const emptySocialLinks = (): SocialLinks => ({});

function asOptionalString(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined;
  return String(value);
}

function plainSocialLinks(links: unknown): SocialLinks {
  if (!links || typeof links !== "object") return emptySocialLinks();

  const source = links as Record<string, unknown>;
  return {
    linkedin: asOptionalString(source.linkedin),
    twitter: asOptionalString(source.twitter),
    github: asOptionalString(source.github),
    googleScholar: asOptionalString(source.googleScholar),
    orcid: asOptionalString(source.orcid),
    researchGate: asOptionalString(source.researchGate),
  };
}

function plainProfile(raw: unknown): StudentProfileData {
  if (!raw || typeof raw !== "object") return defaultStudentProfile();

  const source = raw as Record<string, unknown>;
  return {
    avatarUrl: asOptionalString(source.avatarUrl),
    bio: asOptionalString(source.bio),
    phone: asOptionalString(source.phone),
    designation: asOptionalString(source.designation),
    department: asOptionalString(source.department),
    researchInterests: asOptionalString(source.researchInterests),
    website: asOptionalString(source.website),
    socialLinks: plainSocialLinks(source.socialLinks),
  };
}

export function serializeStudentProfile(user: {
  _id: { toString(): string };
  studentId?: string | null;
  name?: string | null;
  email: string;
  profile?: unknown;
  updatedAt?: Date | string;
}): StudentProfileResponse {
  return {
    id: user._id.toString(),
    studentId: asOptionalString(user.studentId),
    name: asOptionalString(user.name),
    email: String(user.email),
    profile: plainProfile(user.profile),
    updatedAt: user.updatedAt
      ? user.updatedAt instanceof Date
        ? user.updatedAt.toISOString()
        : String(user.updatedAt)
      : undefined,
  };
}

export function defaultStudentProfile(): StudentProfileData {
  return {
    socialLinks: emptySocialLinks(),
  };
}
