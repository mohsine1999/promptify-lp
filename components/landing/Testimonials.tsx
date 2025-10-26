import { Quote } from "lucide-react";

import { FadeItem, FadeStagger } from "../animations";

const testimonials = [
  {
    quote:
      "Promptify lets us spin up campaign pages in under an hour. The copy is on-brand and accessibility checks save QA time.",
    author: "Maya Thompson",
    role: "Head of Growth, LaunchKit",
  },
  {
    quote: "Our agency doubled output without hiring. Clients love the live preview and instant multi-lingual support.",
    author: "Jordan Patel",
    role: "Partner, Northbeam Studio",
  },
  {
    quote:
      "The templates feel custom—tokens, motion, and even empty states are sorted. It’s like having a design systems team on demand.",
    author: "Ella Rivera",
    role: "Product Manager, Loop",
  },
];

export function Testimonials() {
  return (
    <section className="section" aria-labelledby="testimonials-title">
      <div className="section__header">
        <h2 id="testimonials-title">Trusted by lean teams shipping fast</h2>
        <p>Promptify drives clarity and confidence for crews focused on outcomes over busywork.</p>
      </div>
      <FadeStagger>
        <div className="testimonials">
          {testimonials.map((testimonial) => (
            <FadeItem key={testimonial.author}>
              <figure className="testimonial-card">
                <Quote aria-hidden className="testimonial-card__icon" />
                <blockquote>{testimonial.quote}</blockquote>
                <figcaption>
                  <span className="testimonial-card__author">{testimonial.author}</span>
                  <span className="testimonial-card__role">{testimonial.role}</span>
                </figcaption>
              </figure>
            </FadeItem>
          ))}
        </div>
      </FadeStagger>
    </section>
  );
}
