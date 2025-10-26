import { BrainCircuit, GaugeCircle, LayoutDashboard, ShieldCheck } from "lucide-react";

import { FadeItem, FadeStagger } from "../animations";

const features = [
  {
    icon: LayoutDashboard,
    title: "Template library",
    description: "40+ premium layouts tuned for SaaS, agencies, and product launches.",
  },
  {
    icon: BrainCircuit,
    title: "AI copy assistant",
    description: "Pair product context with tone and persona presets for tailored messaging.",
  },
  {
    icon: GaugeCircle,
    title: "Realtime editor",
    description: "Side-by-side preview updates instantly with content scoring and heatmap cues.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance & localization",
    description: "Auto-generate privacy/legal sections and translate into 26 locales in seconds.",
  },
];

export function Features() {
  return (
    <section className="section" aria-labelledby="features-title">
      <div className="section__header">
        <h2 id="features-title">Designed to launch polished pages without the busywork</h2>
        <p>
          Every module respects your brand tokens, ensures accessible contrast, and keeps interactions consistent across
          dark and light modes.
        </p>
      </div>
      <FadeStagger>
        <div className="feature-grid">
          {features.map((feature) => (
            <FadeItem key={feature.title}>
              <article className="feature-card" aria-label={feature.title}>
                <feature.icon aria-hidden className="feature-card__icon" />
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            </FadeItem>
          ))}
        </div>
      </FadeStagger>
    </section>
  );
}
