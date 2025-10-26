import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { FadeItem, FadeStagger } from "../animations";
import { Button } from "../ui/button";

const metrics = [
  { value: "<5 min", label: "from idea to publish" },
  { value: "92%", label: "templates ship with AA contrast" },
  { value: "40%", label: "average lift in conversion" },
];

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__aurora" aria-hidden />
      <FadeStagger>
        <FadeItem>
          <span className="badge badge--primary">Built for high-velocity teams</span>
        </FadeItem>
        <FadeItem>
          <h1 className="hero__title">Generate high-converting landing pages in minutes</h1>
        </FadeItem>
        <FadeItem>
          <p className="hero__subtitle">
            Promptify pairs AI-assisted copy with proven layouts so indie makers, agencies, and PMs can launch faster—no
            pixel pushing, no creative debt.
          </p>
        </FadeItem>
        <FadeItem>
          <div className="hero__actions">
            <Button size="lg">Generate your page</Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="#templates">
                Try sample template
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </FadeItem>
      </FadeStagger>
      <div className="hero__preview">
        <Image
          src="/ui/hero-preview.svg"
          alt="Promptify generator preview"
          width={1040}
          height={640}
          className="hero__image"
        />
        <div className="hero__legend">
          <Sparkles aria-hidden />
          Live preview updates as you tweak copy and visuals.
        </div>
      </div>
      <dl className="hero__metrics">
        {metrics.map((metric) => (
          <div key={metric.label} className="hero__metric">
            <dt>{metric.value}</dt>
            <dd>{metric.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
