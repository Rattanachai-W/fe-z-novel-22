import { WriterStudio } from "@/components/writer/writer-studio";
import { getNovelCatalog } from "@/lib/api/novels";
import { buildWriterNovelItems } from "@/lib/writer/dashboard";

export default async function WriterProfilePage() {
  const novels = await getNovelCatalog();

  return <WriterStudio mode="profile" novels={buildWriterNovelItems(novels)} />;
}
