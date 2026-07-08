"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { BRAND_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

const NAV = [
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/book", label: "Book Demo" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/[0.06] bg-[#05070a]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-3" suppressHydrationWarning>
          <span className="inline-flex h-2 w-2 rounded-full bg-accent" />
          <span className="font-display text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent">
            {BRAND_NAME}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              suppressHydrationWarning
              className={cn(
                "text-sm transition-colors",
                pathname.startsWith(item.href)
                  ? "text-white"
                  : "text-white/50 hover:text-white",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/book">
            <Button size="sm">Book Demo</Button>
          </Link>
        </div>

        <button
          type="button"
          className="text-white/70 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-white/[0.06] bg-[#05070a]/95 px-6 py-4 md:hidden"
        >
          <nav className="flex flex-col gap-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm text-white/70"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/book" onClick={() => setOpen(false)}>
              <Button size="sm" className="w-full">
                Book Demo
              </Button>
            </Link>
          </nav>
        </motion.div>
      )}
    </header>
  );
}
