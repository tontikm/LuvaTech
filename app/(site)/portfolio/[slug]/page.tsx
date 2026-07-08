import { notFound } from "next/navigation";
import { CaseStudyView } from "@/components/portfolio/CaseStudyView";
import { CASE_STUDIES, getCaseStudy } from "@/lib/data/case-studies";

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  return <CaseStudyView study={study} />;
}
