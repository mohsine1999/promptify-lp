import Image from "next/image";

import { FadeItem, FadeStagger } from "../animations";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const templateCategories = {
  saas: [
    {
      title: "SaaS metrics dashboard",
      description: "Data-led layout with hero KPI strip, feature highlights, and product-led pricing table.",
      image: "/ui/template-saas.svg",
    },
    {
      title: "Developer tools",
      description: "Lightweight hero with code sample tabs, integration logos, and docs CTA.",
      image: "/ui/template-dev.svg",
    },
  ],
  agency: [
    {
      title: "Creative agency",
      description: "Split hero with testimonial slider, service grid, and case study carousel.",
      image: "/ui/template-agency.svg",
    },
    {
      title: "Consulting studio",
      description: "Trust-building hero, process timeline, and lead capture form with segmentation.",
      image: "/ui/template-consulting.svg",
    },
  ],
  ecommerce: [
    {
      title: "D2C launch",
      description: "Editorial hero, variant selector, bundle upsell, and social proof stack.",
      image: "/ui/template-d2c.svg",
    },
    {
      title: "Waitlist drop",
      description: "Countdown block, restock notification form, and trending products feed.",
      image: "/ui/template-waitlist.svg",
    },
  ],
};

type TemplateKey = keyof typeof templateCategories;
const templateKeys: TemplateKey[] = ["saas", "agency", "ecommerce"];

export function Templates() {
  return (
    <section
      className="section section--templates"
      id="templates"
      aria-labelledby="templates-title"
      data-surface="layered"
      data-width="wide"
    >
      <div className="section__header">
        <h2 id="templates-title">Templates engineered for conversion</h2>
        <p>
          Each layout is QA’d for accessibility, responsive choreography, and performance. Switch themes, swap content,
          and deploy instantly.
        </p>
      </div>
      <Tabs defaultValue="saas" className="templates-tabs">
        <TabsList aria-label="Template categories">
          {templateKeys.map((key) => (
            <TabsTrigger key={key} value={key}>
              {key === "saas" ? "SaaS" : key === "agency" ? "Agency" : "Ecommerce"}
            </TabsTrigger>
          ))}
        </TabsList>
        {templateKeys.map((key) => (
          <TabsContent key={key} value={key} className="templates-grid">
            <FadeStagger>
              {templateCategories[key].map((template) => (
                <FadeItem key={template.title}>
                  <article className="lp-card">
                    <div className="lp-card__image">
                      <Image src={template.image} alt="" width={520} height={320} />
                    </div>
                    <div className="lp-card__body">
                      <h3>{template.title}</h3>
                      <p>{template.description}</p>
                      <Button variant="outline" size="sm" className="lp-card__cta">
                        Preview template
                      </Button>
                    </div>
                  </article>
                </FadeItem>
              ))}
              <FadeItem>
                <article className="lp-card is-loading" aria-live="polite">
                  <div className="skeleton" />
                  <div className="lp-card__body">
                    <div className="skeleton skeleton--text" />
                    <div className="skeleton skeleton--text" />
                    <div className="skeleton skeleton--button" />
                  </div>
                </article>
              </FadeItem>
            </FadeStagger>
          </TabsContent>
        ))}
      </Tabs>
      <div className="section__footer">
        <Button size="lg">Generate your page</Button>
        <Button variant="ghost" size="lg">
          Try sample template
        </Button>
      </div>
    </section>
  );
}
