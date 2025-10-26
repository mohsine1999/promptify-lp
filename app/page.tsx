import { FAQ } from "../components/landing/FAQ";
import { Features } from "../components/landing/Features";
import { Footer } from "../components/landing/Footer";
import { GeneratorForm } from "../components/landing/GeneratorForm";
import { Hero } from "../components/landing/Hero";
import { Pricing } from "../components/landing/Pricing";
import { Steps } from "../components/landing/Steps";
import { Templates } from "../components/landing/Templates";
import { Testimonials } from "../components/landing/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Steps />
      <Templates />
      <GeneratorForm />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </>
  );
}
