import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AiAssistant } from "@/components/chat/AiAssistant";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import { BRAND_DESCRIPTION, BRAND_NAME, BRAND_TAGLINE } from "@/lib/site";

export const metadata: Metadata = {
  title: `${BRAND_NAME} · Business Automation & Software`,
  description: BRAND_DESCRIPTION,
  openGraph: {
    title: BRAND_TAGLINE,
    description: BRAND_DESCRIPTION,
  },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnalyticsTracker />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <AiAssistant />
    </>
  );
}
