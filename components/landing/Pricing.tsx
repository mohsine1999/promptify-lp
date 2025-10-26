import { Check, Loader2 } from "lucide-react";

import { FadeItem, FadeStagger } from "../animations";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const pricing = {
  monthly: [
    {
      name: "Starter",
      price: "$29",
      description: "For solo builders shipping campaigns monthly.",
      popular: false,
      features: ["10 AI generations", "5 hosted pages", "Basic analytics"],
    },
    {
      name: "Growth",
      price: "$79",
      description: "Best for agencies managing multiple brands.",
      popular: true,
      features: ["Unlimited generations", "25 hosted pages", "Team collaboration", "Custom domains"],
    },
    {
      name: "Scale",
      price: "$149",
      description: "Product orgs needing governance and SSO.",
      popular: false,
      features: ["Unlimited everything", "SOC2 export", "SAML/SSO", "Priority support"],
    },
  ],
  yearly: [
    {
      name: "Starter",
      price: "$290",
      description: "Two months free when billed annually.",
      popular: false,
      features: ["120 AI generations", "60 hosted pages", "Email support"],
    },
    {
      name: "Growth",
      price: "$790",
      description: "Popular with boutique agencies and studios.",
      popular: true,
      features: ["Unlimited generations", "300 hosted pages", "Roles & permissions", "Review workflows"],
    },
    {
      name: "Scale",
      price: "$1,490",
      description: "Designed for enterprise marketing teams.",
      popular: false,
      features: ["Unlimited everything", "Audit logs", "Custom SLA", "Dedicated success"],
    },
  ],
};

type Billing = keyof typeof pricing;
const billings: Billing[] = ["monthly", "yearly"];

export function Pricing() {
  return (
    <section className="section" id="pricing" aria-labelledby="pricing-title">
      <div className="section__header">
        <h2 id="pricing-title">Pricing that flexes with your launch cadence</h2>
        <p>Switch plans anytime. All tiers include accessible templates, instant previews, and export options.</p>
      </div>
      <Tabs defaultValue="monthly" className="pricing-tabs">
        <TabsList aria-label="Billing cadence">
          {billings.map((billing) => (
            <TabsTrigger key={billing} value={billing}>
              {billing === "monthly" ? "Monthly" : "Yearly (save 20%)"}
            </TabsTrigger>
          ))}
        </TabsList>
        {billings.map((billing) => (
          <TabsContent key={billing} value={billing} className="pricing-grid">
            <FadeStagger>
              {pricing[billing].map((plan) => (
                <FadeItem key={plan.name}>
                  <article className={`plan-card${plan.popular ? " is-popular" : ""}`}>
                    {plan.popular ? <span className="plan-card__badge">Most popular</span> : null}
                    <header>
                      <h3>{plan.name}</h3>
                      <p className="plan-card__price">
                        <span>{plan.price}</span>
                        <span className="plan-card__billing">{billing === "monthly" ? "/month" : "/year"}</span>
                      </p>
                      <p className="plan-card__description">{plan.description}</p>
                    </header>
                    <ul className="plan-card__features">
                      {plan.features.map((feature) => (
                        <li key={feature}>
                          <Check aria-hidden />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button size="lg" variant={plan.popular ? "primary" : "outline"} className="plan-card__cta">
                      {plan.popular ? "Generate your page" : "Start trial"}
                    </Button>
                  </article>
                </FadeItem>
              ))}
              <FadeItem>
                <article className="plan-card is-loading" aria-live="polite">
                  <header>
                    <div className="skeleton skeleton--title" />
                    <div className="skeleton skeleton--text" />
                  </header>
                  <div className="skeleton skeleton--list" />
                  <Button size="lg" variant="outline" className="plan-card__cta" disabled>
                    <Loader2 className="spinner" aria-hidden />
                    Loading
                  </Button>
                </article>
              </FadeItem>
            </FadeStagger>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
