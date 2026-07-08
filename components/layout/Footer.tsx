import Link from "next/link";
import { BRAND_NAME, CONTACT, SOCIAL } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#05070a]">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="font-display text-lg font-semibold tracking-tight">
              {BRAND_NAME}
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/50">
            AI systems, automation, and premium web products for businesses that refuse to
            operate manually.
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-white/40">
            Company
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li>
              <Link href="/services" className="hover:text-white">
                Services
              </Link>
            </li>
            <li>
              <Link href="/portfolio" className="hover:text-white">
                Portfolio
              </Link>
            </li>
            <li>
              <Link href="/book" className="hover:text-white">
                Book Demo
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-white/40">
            Contact
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li>{CONTACT.email}</li>
            <li>{CONTACT.phone}</li>
            <li>{CONTACT.location}</li>
            <li>
              <a href={SOCIAL.linkedin} className="hover:text-white">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/[0.06] px-6 py-6 text-center text-xs text-white/30">
        © {new Date().getFullYear()} {BRAND_NAME}. Built with the same stack we deploy for
        clients.
      </div>
    </footer>
  );
}
