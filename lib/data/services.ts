export type ServicePackage = {
  name: string;
  price: number;
  timeline: string;
  description: string;
  includes: string[];
  highlighted?: boolean;
};

export type Service = {
  slug: string;
  title: string;
  headline: string;
  description: string;
  outcomes: string[];
  capabilities: string[];
  techStack: string[];
  startingFrom: number;
  timeline: string;
  icon: string;
  packages: ServicePackage[];
};

export const SERVICES: Service[] = [
  {
    slug: "website-development",
    title: "Website Development",
    headline: "Premium websites that convert visitors into qualified leads.",
    description:
      "We design and build fast, accessible marketing sites and web applications with the polish of a SaaS product, not a template. Every page is engineered for performance, SEO, and measurable conversion.",
    outcomes: [
      "Sub-second load times on mobile",
      "Lead capture wired to your CRM from day one",
      "Analytics and conversion tracking built in",
    ],
    capabilities: [
      "Custom Next.js applications",
      "CMS integration and content workflows",
      "Landing page A/B testing infrastructure",
      "Multi-language and regional deployments",
    ],
    techStack: ["Next.js", "React", "Tailwind CSS", "Vercel", "Supabase"],
    startingFrom: 45000,
    timeline: "4 to 8 weeks",
    icon: "Globe",
    packages: [
      {
        name: "Launch",
        price: 45000,
        timeline: "4 to 5 weeks",
        description: "A polished marketing site that looks premium and converts visitors.",
        includes: [
          "Up to 6 custom pages",
          "Responsive design and SEO basics",
          "Contact and lead capture forms",
          "Analytics setup",
          "Production deploy on Vercel",
        ],
      },
      {
        name: "Growth",
        price: 75000,
        timeline: "6 to 8 weeks",
        description: "A conversion-focused site with CMS and deeper lead workflows.",
        includes: [
          "Everything in Launch",
          "CMS for easy content updates",
          "Blog or resources section",
          "CRM lead handoff",
          "A/B testing hooks",
        ],
        highlighted: true,
      },
      {
        name: "Platform",
        price: 120000,
        timeline: "8 to 12 weeks",
        description: "Full web product experiences for multi-role or logged-in users.",
        includes: [
          "Everything in Growth",
          "Authenticated user areas",
          "Custom dashboards or portals",
          "API integrations",
          "Staging environment and QA cycle",
        ],
      },
    ],
  },
  {
    slug: "ai-chatbots",
    title: "AI Chatbots",
    headline: "Assistants that qualify leads, answer questions, and book meetings 24/7.",
    description:
      "Deploy conversational AI trained on your business, not generic FAQ bots. Our assistants handle qualification, pricing estimates, document generation, and hand-off to your team when it matters.",
    outcomes: [
      "70%+ of enquiries handled without human intervention",
      "Structured lead data captured in every conversation",
      "Consistent brand voice across all channels",
    ],
    capabilities: [
      "Website widget and WhatsApp integration",
      "Tool-calling for quotes, bookings, and CRM updates",
      "Conversation analytics and quality monitoring",
      "Human escalation workflows",
    ],
    techStack: ["OpenAI", "Vercel AI SDK", "Supabase", "Resend"],
    startingFrom: 35000,
    timeline: "2 to 4 weeks",
    icon: "MessageSquare",
    packages: [
      {
        name: "Starter Bot",
        price: 35000,
        timeline: "2 to 3 weeks",
        description: "A website assistant trained on your FAQs and services.",
        includes: [
          "Floating chat widget",
          "Business knowledge base training",
          "Lead capture fields",
          "Email notifications",
          "Conversation transcript logging",
        ],
      },
      {
        name: "Sales Assistant",
        price: 65000,
        timeline: "3 to 5 weeks",
        description: "An AI that qualifies leads, estimates pricing, and books demos.",
        includes: [
          "Everything in Starter Bot",
          "Quote estimation tools",
          "Booking calendar handoff",
          "CRM field updates",
          "Escalation to human agents",
        ],
        highlighted: true,
      },
      {
        name: "Omni Channel",
        price: 110000,
        timeline: "5 to 8 weeks",
        description: "Assistants across web and WhatsApp with shared memory and analytics.",
        includes: [
          "Everything in Sales Assistant",
          "WhatsApp integration",
          "Multi-language support",
          "Quality monitoring dashboard",
          "Custom tool integrations",
        ],
      },
    ],
  },
  {
    slug: "business-automation",
    title: "Business Automation",
    headline: "Replace manual processes with reliable, auditable workflows.",
    description:
      "From invoice processing to onboarding sequences, we map your operations and automate the repetitive work with error handling, logging, and dashboards so you stay in control.",
    outcomes: [
      "Hours reclaimed from admin every week",
      "Fewer data entry errors across teams",
      "Real-time visibility into process bottlenecks",
    ],
    capabilities: [
      "Workflow orchestration (n8n, custom APIs)",
      "Document parsing and data extraction",
      "Slack, email, and spreadsheet integrations",
      "Scheduled jobs and event-driven triggers",
    ],
    techStack: ["Node.js", "PostgreSQL", "REST APIs", "Webhooks"],
    startingFrom: 40000,
    timeline: "3 to 6 weeks",
    icon: "Workflow",
    packages: [
      {
        name: "Single Flow",
        price: 40000,
        timeline: "3 to 4 weeks",
        description: "One high-impact process automated end to end.",
        includes: [
          "Process discovery workshop",
          "One core automation workflow",
          "Error alerts and retries",
          "Basic run logging",
          "Handover documentation",
        ],
      },
      {
        name: "Ops Suite",
        price: 85000,
        timeline: "5 to 7 weeks",
        description: "Multiple connected workflows across teams and tools.",
        includes: [
          "Everything in Single Flow",
          "Up to 5 workflows",
          "Slack or email triggers",
          "Spreadsheet and CRM sync",
          "Ops health dashboard",
        ],
        highlighted: true,
      },
      {
        name: "Enterprise Ops",
        price: 150000,
        timeline: "8 to 12 weeks",
        description: "Department-wide automation with audit trails and controls.",
        includes: [
          "Everything in Ops Suite",
          "Document AI extraction",
          "Role-based approvals",
          "Audit logging",
          "Ongoing iteration window",
        ],
      },
    ],
  },
  {
    slug: "crm-systems",
    title: "CRM Systems",
    headline: "Custom CRMs built around how your team actually sells and serves.",
    description:
      "Off-the-shelf CRMs force you to adapt. We build pipelines, dashboards, and automations tailored to your sales process, with the integrations your team already uses.",
    outcomes: [
      "Single source of truth for leads and customers",
      "Automated follow-ups and task assignment",
      "Revenue forecasting from live pipeline data",
    ],
    capabilities: [
      "Lead scoring and pipeline stages",
      "Activity timelines and notes",
      "Role-based access and audit logs",
      "Email and calendar sync",
    ],
    techStack: ["Next.js", "Supabase", "Prisma", "PostgreSQL"],
    startingFrom: 55000,
    timeline: "6 to 10 weeks",
    icon: "Users",
    packages: [
      {
        name: "Pipeline",
        price: 55000,
        timeline: "6 to 7 weeks",
        description: "A clean CRM for leads, deals, and follow-ups.",
        includes: [
          "Lead and deal pipeline",
          "Contact records and notes",
          "Task assignments",
          "Basic reporting",
          "Role-based access",
        ],
      },
      {
        name: "Revenue CRM",
        price: 95000,
        timeline: "8 to 10 weeks",
        description: "Sales CRM with scoring, forecasts, and automation.",
        includes: [
          "Everything in Pipeline",
          "Lead scoring",
          "Email/calendar sync",
          "Automated follow-ups",
          "Revenue forecasting views",
        ],
        highlighted: true,
      },
      {
        name: "Full Stack CRM",
        price: 160000,
        timeline: "10 to 14 weeks",
        description: "CRM plus customer success and service workflows.",
        includes: [
          "Everything in Revenue CRM",
          "Support ticket flows",
          "Customer health scores",
          "Accounting integrations",
          "Audit logs and exports",
        ],
      },
    ],
  },
  {
    slug: "internal-dashboards",
    title: "Internal Dashboards",
    headline: "Operational command centres for teams that run on data.",
    description:
      "Replace scattered spreadsheets with live dashboards covering KPIs, approvals, inventory, staffing, and finance. Designed for the people who use them every day.",
    outcomes: [
      "Decisions made from live data, not stale exports",
      "Role-specific views for each department",
      "Mobile-friendly for field and floor teams",
    ],
    capabilities: [
      "Real-time charts and KPI widgets",
      "Export, filtering, and saved views",
      "Approval workflows and notifications",
      "Embedded reporting for executives",
    ],
    techStack: ["React", "PostgreSQL", "Chart libraries", "Auth"],
    startingFrom: 50000,
    timeline: "5 to 8 weeks",
    icon: "LayoutDashboard",
    packages: [
      {
        name: "KPI Board",
        price: 50000,
        timeline: "5 to 6 weeks",
        description: "A focused dashboard for your most important metrics.",
        includes: [
          "Up to 8 KPI widgets",
          "Secure login",
          "Filters and date ranges",
          "CSV export",
          "Mobile-friendly layout",
        ],
      },
      {
        name: "Ops Control",
        price: 90000,
        timeline: "6 to 8 weeks",
        description: "Multi-team dashboards with alerts and saved views.",
        includes: [
          "Everything in KPI Board",
          "Role-specific views",
          "Threshold alerts",
          "Saved views per team",
          "Approval workflow cards",
        ],
        highlighted: true,
      },
      {
        name: "Executive Suite",
        price: 140000,
        timeline: "8 to 12 weeks",
        description: "Company-wide reporting with department drill-downs.",
        includes: [
          "Everything in Ops Control",
          "Multi-department modules",
          "Scheduled PDF reports",
          "Data warehouse connectors",
          "Admin configuration panel",
        ],
      },
    ],
  },
  {
    slug: "appointment-systems",
    title: "Appointment Systems",
    headline: "Booking flows that respect your calendar and your customers' time.",
    description:
      "Self-serve scheduling with availability rules, reminders, buffer times, and team routing, integrated with your website, chatbot, and CRM.",
    outcomes: [
      "No-show rates reduced with automated reminders",
      "Staff calendars synced automatically",
      "Booking data flows into your sales pipeline",
    ],
    capabilities: [
      "Multi-staff and multi-location scheduling",
      "Timezone-aware availability",
      "SMS and email confirmations",
      "Waitlists and rescheduling",
    ],
    techStack: ["Next.js", "PostgreSQL", "Calendar APIs", "Resend"],
    startingFrom: 30000,
    timeline: "3 to 5 weeks",
    icon: "Calendar",
    packages: [
      {
        name: "Solo Book",
        price: 30000,
        timeline: "3 to 4 weeks",
        description: "Self-serve bookings for a single provider or team.",
        includes: [
          "Public booking page",
          "Availability rules",
          "Email confirmations",
          "Admin calendar view",
          "Basic reminders",
        ],
      },
      {
        name: "Team Book",
        price: 55000,
        timeline: "4 to 6 weeks",
        description: "Multi-staff booking with routing and reminders.",
        includes: [
          "Everything in Solo Book",
          "Staff routing",
          "SMS reminders",
          "Buffer and travel times",
          "CRM sync",
        ],
        highlighted: true,
      },
      {
        name: "Network Book",
        price: 95000,
        timeline: "6 to 9 weeks",
        description: "Multi-location scheduling with waitlists and rescheduling.",
        includes: [
          "Everything in Team Book",
          "Multi-location support",
          "Waitlists",
          "Customer self-reschedule",
          "Reporting dashboard",
        ],
      },
    ],
  },
  {
    slug: "quotation-systems",
    title: "Quotation Systems",
    headline: "Professional quotes generated in minutes, not hours.",
    description:
      "Guided quote builders, PDF generation, e-signature ready documents, and automated follow-up so your sales team closes faster with fewer errors.",
    outcomes: [
      "Quote turnaround from days to minutes",
      "Branded PDFs emailed automatically",
      "Win/loss tracking tied to each proposal",
    ],
    capabilities: [
      "Configurable pricing rules and packages",
      "PDF generation with your brand",
      "Quote versioning and approval chains",
      "CRM and accounting integrations",
    ],
    techStack: ["React PDF", "PostgreSQL", "Resend", "OpenAI"],
    startingFrom: 35000,
    timeline: "3 to 6 weeks",
    icon: "FileText",
    packages: [
      {
        name: "Quote Lite",
        price: 35000,
        timeline: "3 to 4 weeks",
        description: "Branded quote builder with PDF delivery.",
        includes: [
          "Guided quote form",
          "Branded PDF output",
          "Email delivery",
          "Quote history",
          "Basic pricing rules",
        ],
      },
      {
        name: "Sales Quotes",
        price: 70000,
        timeline: "4 to 6 weeks",
        description: "Package rules, approvals, and CRM tracking.",
        includes: [
          "Everything in Quote Lite",
          "Package and discount rules",
          "Internal approval chain",
          "Win/loss tracking",
          "CRM sync",
        ],
        highlighted: true,
      },
      {
        name: "Proposal Engine",
        price: 120000,
        timeline: "6 to 10 weeks",
        description: "AI-assisted proposals with versioning and signatures.",
        includes: [
          "Everything in Sales Quotes",
          "AI-assisted proposal copy",
          "Quote versioning",
          "E-signature ready docs",
          "Accounting integration",
        ],
      },
    ],
  },
  {
    slug: "api-integrations",
    title: "API Integrations",
    headline: "Connect the tools you already pay for into one coherent system.",
    description:
      "Xero, Payfast, Shopify, WhatsApp, and legacy ERPs. We build robust integrations with retry logic, monitoring, and documentation your team can maintain.",
    outcomes: [
      "Eliminate duplicate data entry between systems",
      "Reliable sync with error alerting",
      "Documented APIs for future extensions",
    ],
    capabilities: [
      "REST and webhook integrations",
      "OAuth and secure credential storage",
      "Rate limiting and queue-based processing",
      "Integration health dashboards",
    ],
    techStack: ["Node.js", "PostgreSQL", "Redis", "Webhooks"],
    startingFrom: 25000,
    timeline: "2 to 4 weeks",
    icon: "Plug",
    packages: [
      {
        name: "One Connect",
        price: 25000,
        timeline: "2 to 3 weeks",
        description: "A reliable sync between two systems.",
        includes: [
          "One primary integration",
          "Auth and credential storage",
          "Retry logic",
          "Failure alerts",
          "Documentation",
        ],
      },
      {
        name: "Hub Sync",
        price: 55000,
        timeline: "3 to 5 weeks",
        description: "Multiple integrations with monitoring.",
        includes: [
          "Everything in One Connect",
          "Up to 4 systems",
          "Webhook handlers",
          "Health dashboard",
          "Queue-based processing",
        ],
        highlighted: true,
      },
      {
        name: "Platform Glue",
        price: 100000,
        timeline: "5 to 8 weeks",
        description: "Enterprise-grade middleware with observability.",
        includes: [
          "Everything in Hub Sync",
          "Custom mapping layer",
          "Rate limiting controls",
          "Replay tools",
          "SLA-oriented monitoring",
        ],
      },
    ],
  },
  {
    slug: "cloud-solutions",
    title: "Cloud Solutions",
    headline: "Infrastructure that scales with your business without the DevOps headache.",
    description:
      "We architect, deploy, and monitor cloud environments on Vercel, AWS, and Supabase, with CI/CD, staging environments, and security best practices from day one.",
    outcomes: [
      "Production deployments in hours, not weeks",
      "Automated backups and environment parity",
      "Cost-optimised scaling as traffic grows",
    ],
    capabilities: [
      "Vercel and AWS deployments",
      "Database migrations and backups",
      "Environment and secrets management",
      "Uptime monitoring and alerting",
    ],
    techStack: ["Vercel", "AWS", "Supabase", "GitHub Actions"],
    startingFrom: 20000,
    timeline: "1 to 3 weeks",
    icon: "Cloud",
    packages: [
      {
        name: "Launch Stack",
        price: 20000,
        timeline: "1 to 2 weeks",
        description: "Production-ready hosting for a new Next.js app.",
        includes: [
          "Vercel production setup",
          "Environment variables",
          "Custom domain SSL",
          "Basic uptime checks",
          "Deploy documentation",
        ],
      },
      {
        name: "Pro Ops",
        price: 45000,
        timeline: "2 to 4 weeks",
        description: "Staging, CI/CD, and backups for growing products.",
        includes: [
          "Everything in Launch Stack",
          "Staging environment",
          "GitHub Actions CI/CD",
          "Database backups",
          "Secrets management",
        ],
        highlighted: true,
      },
      {
        name: "Scale Cloud",
        price: 90000,
        timeline: "4 to 6 weeks",
        description: "Hardened multi-env infrastructure with observability.",
        includes: [
          "Everything in Pro Ops",
          "AWS components where needed",
          "Alerting and log drains",
          "Cost reviews",
          "Disaster recovery plan",
        ],
      },
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
