import { PublicGalleryPage } from "@/components/site/PublicGalleryPage";
import { getPublishedGallerySections } from "@/lib/gallery";

export const metadata = {
  title: "Gallery — MVI Lab",
  description: "Photo galleries from Machine Vision and Intelligence Lab.",
};

export default async function GalleryPage() {
  const sections = await getPublishedGallerySections();
  return <PublicGalleryPage sections={sections} />;
}
