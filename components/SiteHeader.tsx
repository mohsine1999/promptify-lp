"use client";

import { Command, Search, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  { href: "#templates", label: "Templates" },
  { href: "#pricing", label: "Pricing" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className={cn("site-header", isOpen && "is-open")}> 
      <div className="site-header__inner">
        <Link href="/" className="brand" aria-label="Promptify">
          <Sparkles aria-hidden className="brand__icon" />
          <span className="brand__label">Promptify</span>
        </Link>
        <nav
          id="primary-navigation"
          className={cn("site-nav", isOpen && "is-open")}
          aria-label="Primary navigation"
        >
          <div className="site-nav__links">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className="nav-link">
                {label}
              </Link>
            ))}
          </div>
          <div className="site-nav__meta">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="nav-link__search">
                  <Search size={18} aria-hidden />
                  Quick search
                  <kbd className="kbd">
                    <Command size={14} aria-hidden />
                    K
                  </kbd>
                </Button>
              </DialogTrigger>
              <DialogContent className="dialog-search">
                <DialogTitle>Search templates</DialogTitle>
                <Command label="Search templates">
                  <CommandInput placeholder="Try: SaaS analytics, D2C skincare, agency" aria-label="Search templates" />
                  <CommandList>
                    <CommandEmpty>No templates found.</CommandEmpty>
                    <CommandGroup heading="Popular">
                      <CommandItem value="saas dashboard">SaaS dashboard</CommandItem>
                      <CommandItem value="agency portfolio">Agency portfolio</CommandItem>
                      <CommandItem value="product hunt">Product Hunt launch</CommandItem>
                    </CommandGroup>
                    <CommandGroup heading="Use cases">
                      <CommandItem value="freelancer">Freelancer services</CommandItem>
                      <CommandItem value="ecommerce launch">Ecommerce drop</CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </DialogContent>
            </Dialog>
            <ThemeToggle />
            <Button variant="ghost" className="nav-link__account">
              <User size={18} aria-hidden />
              Sign in
            </Button>
            <Button size="sm" className="site-nav__cta">Generate your page</Button>
          </div>
        </nav>
        <button
          className={cn("site-nav__toggle", isOpen && "is-open")}
          onClick={() => setIsOpen((prev) => !prev)}
          type="button"
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
          aria-label="Toggle navigation"
        >
          <span />
        </button>
      </div>
      {isOpen ? <button type="button" className="site-nav__backdrop" aria-hidden onClick={() => setIsOpen(false)} /> : null}
    </header>
  );
}

export default SiteHeader;
