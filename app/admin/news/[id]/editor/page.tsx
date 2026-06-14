import { notFound } from "next/navigation";
import { NewsArticleEditor } from "@/components/admin/NewsArticleEditor";
import { getNewsArticleById } from "@/lib/news";

export const metadata = {
  title: "News Page Editor — MVI Lab Admin",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminNewsEditorPage({ params }: PageProps) {
  const { id } = await params;
  const article = await getNewsArticleById(id);

  if (!article) notFound();

  return (
    <NewsArticleEditor
      articleId={article.id}
      title={article.title}
      slug={article.slug}
      initialBlocks={article.blocks}
      isPublished={article.isPublished}
    />
  );
}
