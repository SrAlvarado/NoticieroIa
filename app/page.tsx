import { LatestHero } from "@/components/latest-hero";
import { CategorySection } from "@/components/category-section";
import { getArticles, getBreakingArticles } from "@/lib/articles";
import { nonBreakingCategories } from "@/lib/categories";

export default async function HomePage() {
  const [breaking, all] = await Promise.all([
    getBreakingArticles(),
    getArticles(),
  ]);

  return (
    <>
      <LatestHero articles={breaking} />
      {nonBreakingCategories().map((cat) => (
        <CategorySection
          key={cat.slug}
          category={cat}
          articles={all.filter((a) => a.category === cat.slug)}
        />
      ))}
    </>
  );
}
