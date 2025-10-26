import { CheckCircle2, Edit3, Rocket } from "lucide-react";

import { FadeItem, FadeStagger } from "../animations";

const steps = [
  {
    step: "01",
    title: "Generate",
    description: "Drop in your product link or brief. Promptify pulls key benefits, tone, and imagery suggestions.",
    icon: CheckCircle2,
  },
  {
    step: "02",
    title: "Tweak",
    description: "Edit copy inline, swap modules, and preview responsive breakpoints with container queries.",
    icon: Edit3,
  },
  {
    step: "03",
    title: "Publish",
    description: "Ship to your custom domain, export to Next.js, or sync to Webflow—analytics and GDPR baked in.",
    icon: Rocket,
  },
];

export function Steps() {
  return (
    <section className="section" id="how-it-works" aria-labelledby="steps-title">
      <div className="section__header">
        <h2 id="steps-title">Three steps from prompt to production</h2>
        <p>Every handoff is accessible, performant, and ready for traffic spikes.</p>
      </div>
      <FadeStagger>
        <ol className="steps">
          {steps.map((step) => (
            <FadeItem key={step.title}>
              <li className="step-card">
                <span className="step-card__number">{step.step}</span>
                <div className="step-card__icon" aria-hidden>
                  <step.icon />
                </div>
                <div className="step-card__body">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            </FadeItem>
          ))}
        </ol>
      </FadeStagger>
    </section>
  );
}
