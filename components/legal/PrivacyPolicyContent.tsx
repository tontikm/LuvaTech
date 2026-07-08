import { BRAND_NAME, CONTACT, LEGAL } from "@/lib/site";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-semibold tracking-tight text-white">
        {title}
      </h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/60">{children}</div>
    </section>
  );
}

export function PrivacyPolicyContent() {
  return (
    <article>
      <p className="text-sm text-white/40">Effective {LEGAL.policyEffectiveDate}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        Privacy Policy
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-white/50 leading-relaxed">
        This notice explains how {LEGAL.tradingName} collects, uses, and protects your
        personal information in line with the Protection of Personal Information Act, 2013
        (POPIA).
      </p>

      <Section title="1. Who we are">
        <p>
          {LEGAL.tradingName} ({CONTACT.location}) provides business automation, software
          development, and related consulting services. For the purposes of POPIA,{" "}
          {LEGAL.tradingName} is the responsible party for personal information collected
          through this website.
        </p>
      </Section>

      <Section title="2. Information Officer">
        <p>
          You may contact our Information Officer for any privacy-related request, including
          access, correction, or deletion of your personal information:
        </p>
        <p>
          Email:{" "}
          <a
            href={`mailto:${LEGAL.informationOfficerEmail}`}
            className="text-accent hover:underline"
          >
            {LEGAL.informationOfficerEmail}
          </a>
        </p>
      </Section>

      <Section title="3. Personal information we collect">
        <p>Depending on how you use this website, we may collect:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-white/80">Booking a consultation:</strong> name, email
            address, company name (optional), notes, and your chosen appointment date and
            time.
          </li>
          <li>
            <strong className="text-white/80">AI assistant and quotes:</strong> chat
            messages, a session identifier, and business enquiry details you provide (such
            as business name, contact name, email, phone, industry, team size, project
            requirements, budget range, and timeline).
          </li>
          <li>
            <strong className="text-white/80">Site analytics:</strong> pages you visit on
            this website and events such as starting a chat (first-party analytics only — we
            do not use Google Analytics or advertising trackers).
          </li>
          <li>
            <strong className="text-white/80">Admin access:</strong> email address and
            authentication session data for authorised staff who log in to our internal
            dashboard (not applicable to general visitors).
          </li>
        </ul>
      </Section>

      <Section title="4. How we collect it">
        <p>We collect personal information when you:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Submit the consultation booking form</li>
          <li>Chat with our AI assistant or request a quotation</li>
          <li>Browse pages on this website (analytics events)</li>
          <li>Contact us by email or phone</li>
        </ul>
        <p>
          The public website does not use marketing or advertising cookies. Session cookies
          are used only for admin login at <code className="text-white/70">/admin</code>.
        </p>
      </Section>

      <Section title="5. Why we process your information">
        <p>We use personal information to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Respond to enquiries and provide customer support</li>
          <li>Generate and email project quotations</li>
          <li>Confirm and manage consultation bookings</li>
          <li>Operate and improve this website</li>
          <li>Protect the website against abuse (including rate limiting and security monitoring)</li>
          <li>Maintain business records for leads, quotes, and meetings</li>
        </ul>
      </Section>

      <Section title="6. Lawful basis">
        <p>
          We process personal information based on your consent when you submit a form or use
          the AI assistant, and on our legitimate interests where necessary to operate the
          website securely, understand how it is used, and follow up on business enquiries.
        </p>
      </Section>

      <Section title="7. Who we share information with">
        <p>
          We use trusted service providers to run this website. They process data on our
          instructions and only as needed to provide their services:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-white/80">Supabase</strong> — database hosting and
            admin authentication
          </li>
          <li>
            <strong className="text-white/80">Vercel</strong> — website hosting
          </li>
          <li>
            <strong className="text-white/80">OpenAI</strong> — AI assistant responses
          </li>
          <li>
            <strong className="text-white/80">Resend</strong> — transactional email
            delivery (quotations and booking confirmations)
          </li>
          <li>
            <strong className="text-white/80">Upstash</strong> — rate limiting and abuse
            prevention (when configured)
          </li>
        </ul>
        <p>We do not sell your personal information.</p>
      </Section>

      <Section title="8. Cross-border transfers">
        <p>
          Some of our service providers may process personal information outside South Africa,
          including in the United States. Where this occurs, we rely on appropriate
          contractual safeguards and the security practices of those providers.
        </p>
      </Section>

      <Section title="9. How long we keep information">
        <p>
          We retain personal information for as long as needed to fulfil the purposes above,
          including managing leads, quotes, bookings, and related business records. Analytics
          events are kept for operational reporting. We do not currently automate deletion
          on a fixed schedule; you may request erasure subject to any legal retention
          requirements.
        </p>
      </Section>

      <Section title="10. Security">
        <p>
          We apply technical and organisational measures to protect personal information,
          including encrypted connections (HTTPS), access controls on our admin dashboard,
          input validation, rate limiting, and server-side storage of sensitive credentials.
        </p>
      </Section>

      <Section title="11. Your rights under POPIA">
        <p>Subject to POPIA, you may have the right to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Request access to personal information we hold about you</li>
          <li>Request correction or deletion of inaccurate or outdated information</li>
          <li>Object to processing in certain circumstances</li>
          <li>Withdraw consent where processing is based on consent</li>
          <li>Lodge a complaint with the Information Regulator</li>
        </ul>
        <p>
          To exercise your rights, email{" "}
          <a
            href={`mailto:${LEGAL.informationOfficerEmail}`}
            className="text-accent hover:underline"
          >
            {LEGAL.informationOfficerEmail}
          </a>
          . You may also contact the Information Regulator at{" "}
          <a
            href={LEGAL.regulatorUrl}
            className="text-accent hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            justice.gov.za/inforeg
          </a>
          .
        </p>
      </Section>

      <Section title="12. Children">
        <p>
          This website is not directed at children under 18. We do not knowingly collect
          personal information from children.
        </p>
      </Section>

      <Section title="13. Changes to this notice">
        <p>
          We may update this Privacy Policy from time to time. The effective date at the top
          of this page will change when we do. Continued use of the website after an update
          constitutes notice of the revised policy.
        </p>
        <p>
          Questions? Contact us at{" "}
          <a href={`mailto:${CONTACT.email}`} className="text-accent hover:underline">
            {CONTACT.email}
          </a>{" "}
          or {CONTACT.phone}.
        </p>
      </Section>

      <p className="mt-12 text-xs text-white/30">
        © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
      </p>
    </article>
  );
}
