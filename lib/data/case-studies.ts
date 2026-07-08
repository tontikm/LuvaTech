export type CaseStudyMetric = {
  label: string;
  before: string;
  after: string;
  improvement: string;
};

export type CaseStudy = {
  slug: string;
  client: string;
  industry: string;
  headline: string;
  summary: string;
  challenge: string;
  solution: string[];
  metrics: CaseStudyMetric[];
  stack: string[];
  testimonial: {
    quote: string;
    author: string;
    role: string;
  };
  demoSections: Array<{
    id: string;
    title: string;
    description: string;
  }>;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "meridian-construction",
    client: "Meridian Construction Group",
    industry: "Construction & Civil Engineering",
    headline: "From manual quoting to automated project enquiries in 6 weeks.",
    summary:
      "Meridian Construction Group managed 40+ weekly project enquiries manually across phone calls, WhatsApp messages, and spreadsheet quotes. We deployed an AI assistant, self-serve quote builder, and operations CRM that cut admin time by 18 hours per week.",
    challenge:
      "Site managers called after hours. Quotes took 24 to 48 hours. Project availability and crew scheduling lived in one person's head. Invoices were typed manually in Word.",
    solution: [
      "AI chatbot trained on services catalog with live pricing",
      "Self-serve quote flow with PDF generation and email delivery",
      "Operations dashboard for quotes to projects to invoices pipeline",
      "Supabase-backed service catalog with structured pricing tiers",
    ],
    metrics: [
      {
        label: "Quote turnaround",
        before: "24 to 48 hrs",
        after: "Under 5 min",
        improvement: "96% faster",
      },
      {
        label: "Admin hours / week",
        before: "22 hrs",
        after: "4 hrs",
        improvement: "18 hrs saved",
      },
      {
        label: "After-hours leads captured",
        before: "12%",
        after: "89%",
        improvement: "+641%",
      },
      {
        label: "Quote-to-order conversion",
        before: "31%",
        after: "54%",
        improvement: "+74%",
      },
    ],
    stack: ["Next.js", "Supabase", "OpenAI", "React PDF", "Resend"],
    testimonial: {
      quote:
        "Our customers get quotes at midnight. Our team walks in to confirmed orders instead of voicemail. LuvaTech built exactly what we described, and it works.",
      author: "Thabo Mokoena",
      role: "Operations Director, Meridian Construction Group",
    },
    demoSections: [
      {
        id: "chatbot",
        title: "AI Project Assistant",
        description:
          "Answers project questions, calculates estimates, and submits formal quote requests. Available 24/7 on mobile and desktop.",
      },
      {
        id: "quote",
        title: "Instant Quote PDF",
        description:
          "Branded quotation with line items, VAT, delivery, and terms. Emailed to customer and owner simultaneously.",
      },
      {
        id: "dashboard",
        title: "Operations CRM",
        description:
          "Accept quotes, convert to orders, generate invoices, and track customers from one secure dashboard.",
      },
    ],
  },
  {
    slug: "nova-dental",
    client: "Nova Dental Group",
    industry: "Healthcare",
    headline: "Patient booking and follow-up automation for a 4-chair practice.",
    summary:
      "Nova Dental lost 23% of new patient enquiries to slow callback times. We built an AI receptionist, online booking, and automated appointment reminders.",
    challenge:
      "Reception overwhelmed during peak hours. No-shows cost R12,000/month. Treatment plans sat in email inboxes.",
    solution: [
      "AI assistant for treatment FAQs and booking",
      "Calendar-integrated scheduling with SMS reminders",
      "Post-visit follow-up sequences via email",
    ],
    metrics: [
      {
        label: "New patient response time",
        before: "4.2 hrs",
        after: "Instant",
        improvement: "100%",
      },
      {
        label: "No-show rate",
        before: "18%",
        after: "7%",
        improvement: "61% reduction",
      },
      {
        label: "Reception call volume",
        before: "85/day",
        after: "52/day",
        improvement: "39% fewer",
      },
      {
        label: "Monthly recovered revenue",
        before: "n/a",
        after: "R34,000",
        improvement: "From reduced no-shows",
      },
    ],
    stack: ["Next.js", "OpenAI", "PostgreSQL", "Twilio", "Resend"],
    testimonial: {
      quote:
        "Patients book at 10pm. Reminders go out automatically. Our reception team finally has breathing room.",
      author: "Dr. Sarah Naidoo",
      role: "Principal Dentist, Nova Dental Group",
    },
    demoSections: [
      {
        id: "chatbot",
        title: "Patient AI Receptionist",
        description: "Handles FAQs, insurance questions, and books available slots.",
      },
      {
        id: "booking",
        title: "Smart Scheduling",
        description: "Chair-aware availability with buffer times and practitioner routing.",
      },
      {
        id: "dashboard",
        title: "Practice Dashboard",
        description: "Daily schedule, no-show tracking, and enquiry analytics.",
      },
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}
