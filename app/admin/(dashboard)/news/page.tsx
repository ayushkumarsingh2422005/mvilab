import { NewsManager } from "@/components/admin/NewsManager";
import { DashboardPageHeader, DashboardWorkspace } from "@/components/dashboard/DashboardPage";
import { getAllNewsArticles } from "@/lib/news";

export const metadata = {
  title: "News — MVI Lab Admin",
};

export default async function AdminNewsPage() {
  const articles = await getAllNewsArticles();

  return (
    <>
      <DashboardPageHeader
        title="News"
        description="Create news articles, manage slugs, and design full pages with the visual editor."
      />
      <DashboardWorkspace>
        <NewsManager initialArticles={articles} />
      </DashboardWorkspace>
    </>
  );
}
