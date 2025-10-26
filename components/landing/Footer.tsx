import Link from "next/link";

import { Button } from "../ui/button";

export function Footer() {
  return (
    <footer className="footer" aria-labelledby="footer-title">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="brand" id="footer-title">
            Promptify
          </span>
          <p>AI landing page builder for indie makers, agencies, and product teams.</p>
          <Button size="lg">Generate your page</Button>
        </div>
        <nav className="footer__nav" aria-label="Footer">
          <div>
            <h4>Product</h4>
            <Link href="#templates">Templates</Link>
            <Link href="#pricing">Pricing</Link>
            <Link href="#faq">FAQ</Link>
          </div>
          <div>
            <h4>Company</h4>
            <Link href="/">About</Link>
            <Link href="/">Blog</Link>
            <Link href="/">Contact</Link>
          </div>
          <div>
            <h4>Legal</h4>
            <Link href="/">Privacy</Link>
            <Link href="/">Terms</Link>
            <Link href="/">Security</Link>
          </div>
        </nav>
      </div>
      <div className="footer__bottom">
        <small>© {new Date().getFullYear()} Promptify. All rights reserved.</small>
        <div className="footer__meta">
          <Link href="/">Status</Link>
          <Link href="/">Changelog</Link>
        </div>
      </div>
    </footer>
  );
}
