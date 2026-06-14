import { AssetManager } from "@/components/admin/AssetManager";
import { DashboardPageHeader, DashboardWorkspace } from "@/components/dashboard/DashboardPage";
import { ensureDefaultAssetFolders } from "@/lib/assets/mutations";
import { listUploadDirectory } from "@/lib/assets/list";

export const metadata = {
  title: "Assets — MVI Lab Admin",
};

export default async function AdminAssetsPage() {
  await ensureDefaultAssetFolders();

  const result = await listUploadDirectory("");
  if ("error" in result || !result.listing) {
    throw new Error(result.error ?? "Unable to load assets.");
  }

  return (
    <>
      <DashboardPageHeader
        title="Asset manager"
        description="Browse uploads, copy public paths, and manage custom folders for site content."
      />
      <DashboardWorkspace>
        <AssetManager initialListing={result.listing} />
      </DashboardWorkspace>
    </>
  );
}
