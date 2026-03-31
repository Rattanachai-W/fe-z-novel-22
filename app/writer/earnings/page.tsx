import { WriterStudio } from "@/components/writer/writer-studio";
import { getNovelCatalog } from "@/lib/api/novels";
import { buildWriterNovelItems } from "@/lib/writer/dashboard";

export default async function WriterEarningsPage() {
  const novels = await getNovelCatalog();

  return <WriterStudio mode="earnings" novels={buildWriterNovelItems(novels)} />;
}
