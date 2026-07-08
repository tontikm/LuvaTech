import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/site";
import { PrivacyPolicyContent } from "@/components/legal/PrivacyPolicyContent";

export const metadata: Metadata = {
  title: `Privacy Policy · ${BRAND_NAME}`,
  description:
    "How LuvaTech collects, uses, and protects your personal information under POPIA.",
};

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <PrivacyPolicyContent />
      </div>
    </div>
  );
}
