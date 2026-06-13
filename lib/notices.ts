export type Notice = {
  id: string;
  title: string;
  date: string;
  category: "General" | "Research" | "Events" | "Admissions";
  excerpt: string;
  body: string;
  isNew?: boolean;
};

export const notices: Notice[] = [
  {
    id: "portal-launch",
    title: "MVI Lab portal is now live",
    date: "2026-06-01",
    category: "General",
    isNew: true,
    excerpt:
      "Explore research areas, projects, and services from the Machine Vision and Intelligence Lab at NIT Jamshedpur.",
    body: "The official MVI Lab portal is now available at mvilab.in. Browse our research focus, ongoing projects, team profiles, and contact details. Updates and notices will be published here regularly.",
  },
  {
    id: "research-openings",
    title: "Research internship opportunities — applications open",
    date: "2026-05-20",
    category: "Admissions",
    isNew: true,
    excerpt:
      "MVI Lab invites applications from motivated students for research internships in machine vision and intelligent systems.",
    body: "Selected interns will work with faculty mentors on computer vision, deep learning, and applied AI projects. Visit the Contact page or write to the lab for application guidelines and timelines.",
  },
  {
    id: "lab-seminar",
    title: "Upcoming seminar on vision-based inspection systems",
    date: "2026-05-10",
    category: "Events",
    excerpt:
      "Join our seminar on industrial vision systems, defect detection, and real-time inspection pipelines at NIT Jamshedpur.",
    body: "The seminar covers camera calibration, image preprocessing, model deployment, and case studies from manufacturing and quality control. Schedule and venue details will be shared on this portal.",
  },
];

export function getTickerNotices(noticeList: Notice[] = notices): Notice[] {
  const highlighted = noticeList.filter((notice) => notice.isNew);
  return highlighted.length > 0 ? highlighted : noticeList.slice(0, 3);
}

export function formatNoticeDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatNoticeListDate(date: string): string {
  const value = new Date(`${date}T12:00:00`);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}
