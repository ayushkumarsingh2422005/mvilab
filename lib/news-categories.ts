export const NEWS_CATEGORIES = ["General", "Research", "Events", "Admissions"] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];
