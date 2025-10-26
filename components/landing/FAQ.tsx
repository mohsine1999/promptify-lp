import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

const faqItems = [
  {
    question: "How does Promptify keep pages accessible?",
    answer:
      "Every template ships with semantic HTML, WCAG AA contrast checks, focus rings, and reduced motion fallbacks automatically applied.",
  },
  {
    question: "Can I export the code?",
    answer:
      "Yes. Export to Next.js, copy HTML sections, or publish to a custom domain with one click when you’re ready.",
  },
  {
    question: "Do you support team workflows?",
    answer:
      "Growth plans and above include commenting, approvals, and roles so marketing and product can collaborate without chaos.",
  },
  {
    question: "What’s included in the trial?",
    answer:
      "Generate three pages with full editing, template access, and analytics. No credit card required.",
  },
];

export function FAQ() {
  return (
    <section className="section" id="faq" aria-labelledby="faq-title">
      <div className="section__header">
        <h2 id="faq-title">Questions, answered</h2>
        <p>If you need deeper details or a custom plan, reach out at hello@promptify.ai.</p>
      </div>
      <Accordion type="single" collapsible className="faq">
        {faqItems.map((item) => (
          <AccordionItem key={item.question} value={item.question}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
