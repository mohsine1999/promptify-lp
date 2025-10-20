import SitePage, { generateMetadata as generateSiteMetadata } from "@/app/_sites/[site]/page";

export { dynamic } from "@/app/_sites/[site]/page";

type PageProps = {
  params: {
    site: string;
  };
};

export function generateMetadata({ params }: PageProps) {
  return generateSiteMetadata({ params });
}

export default function LandingPageRoute({ params }: PageProps) {
  return <SitePage params={params} />;
}
