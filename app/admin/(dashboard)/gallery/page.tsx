import { GalleryManager } from "@/components/admin/GalleryManager";
import { DashboardPageHeader, DashboardWorkspace } from "@/components/dashboard/DashboardPage";
import { getAllGallerySectionsForAdmin } from "@/lib/gallery";

export const metadata = {
  title: "Gallery — MVI Lab Admin",
};

export default async function AdminGalleryPage() {
  const sections = await getAllGallerySectionsForAdmin();

  return (
    <>
      <DashboardPageHeader
        title="Gallery"
        description="Create titled gallery sections and add multiple photos to each one."
      />
      <DashboardWorkspace>
        <GalleryManager initialSections={sections} />
      </DashboardWorkspace>
    </>
  );
}
