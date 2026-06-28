import { HeroBannerManager } from "@/components/admin/HeroBannerManager";
import { DashboardPageHeader, DashboardWorkspace } from "@/components/dashboard/DashboardPage";
import { getAllHeroSlidesForAdmin } from "@/lib/hero-slides";

export const metadata = {
  title: "Hero banner — MVI Lab Admin",
};

export default async function AdminHeroPage() {
  const slides = await getAllHeroSlidesForAdmin();

  return (
    <>
      <DashboardPageHeader
        title="Hero banner"
        description="Manage the homepage carousel with separate desktop and mobile images."
      />
      <DashboardWorkspace>
        <HeroBannerManager initialSlides={slides} />
      </DashboardWorkspace>
    </>
  );
}
