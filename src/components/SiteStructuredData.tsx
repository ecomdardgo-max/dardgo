import { SITE_URL } from "@/lib/compliance";

const organizationJson = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DardGo Pharma Pvt. Ltd.",
  alternateName: "DARDGO",
  url: SITE_URL,
  logo: `${SITE_URL}/dardgo.png`,
  description:
    "Ayurvedic-inspired herbal wellness brand offering oils, topicals, and traditional formulations for everyday comfort.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "38/K, Mohan Marg",
    addressLocality: "Balaghat",
    addressRegion: "Madhya Pradesh",
    postalCode: "481001",
    addressCountry: "IN",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+91-93299-12659",
      contactType: "customer service",
      email: "care@dardgo.in",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
  ],
  sameAs: [
    "https://facebook.com/dardgo",
    "https://instagram.com/dardgo",
    "https://youtube.com/@dardgo",
  ],
};

const websiteJson = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "DARDGO",
  url: SITE_URL,
  publisher: {
    "@type": "Organization",
    name: "DardGo Pharma Pvt. Ltd.",
    url: SITE_URL,
  },
};

function JsonLd({ id, data }: { id: string; data: object }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function SiteStructuredData() {
  return (
    <>
      <JsonLd id="ld-org" data={organizationJson} />
      <JsonLd id="ld-website" data={websiteJson} />
    </>
  );
}
