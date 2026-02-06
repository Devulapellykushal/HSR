import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import LayoutWrapper from "@/components/common/LayoutWrapper";
import LoadingScreen from "@/components/common/LoadingScreen";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HSR Green Homes | Best Builders & Luxury Properties in Karimnagar",
  description: "Discover premium apartments, villas, and community living in Karimnagar. HSR Green Homes offers the best residential properties with 100% Vasthu compliance, timely delivery, and superior quality construction. Trusted by 2000+ families.",
  keywords: [
    // Core Brand & Service
    "HSR Green Homes",
    "HSR Developers",
    "Green Homes Karimnagar",
    "Best builders in Karimnagar",
    "Top construction companies Karimnagar",
    "Real estate developers Karimnagar",
    "Civil contractors Karimnagar",
    "Construction services Karimnagar",

    // Property Types
    "Luxury apartments Karimnagar",
    "3BHK flats for sale Karimnagar",
    "2BHK flats for sale Karimnagar",
    "Double bedroom houses Karimnagar",
    "Independent houses for sale Karimnagar",
    "Gated community villas Karimnagar",
    "Duplex houses in Karimnagar",
    "Residential high rise buildings",
    "Commercial properties Karimnagar",
    "Open plots for sale Karimnagar",

    // Features & Amenities
    "Vastu compliant homes Telangana",
    "East facing flats Karimnagar",
    "West facing flats Karimnagar",
    "Corner bit plots Karimnagar",
    "Premium construction quality",
    "Luxury amenities apartments",
    "Gated communities with swimming pool",
    "Clubhouse apartments Karimnagar",
    "Kids play area apartments",
    "24/7 security gated community",

    // Location Based
    "Buy flat near me",
    "Properties in Rekurthi",
    "Flats in Thimmapur",
    "Villas near Lower Manair Dam",
    "Apartments near Karimnagar bus stand",
    "Real estate near Satavahana University",
    "Homes near Collectorate Karimnagar",
    "Properties in Housing Board Colony",
    "Flats near Mankammathota",
    "Villas in Wittalrao Nagar",
    "Apartments in Bhagatalab",
    "Houses in Kothirampur",
    "Real estate Jagtial road",
    "Properties Warangal highway",

    // Investment & Buying
    "Affordable housing projects Karimnagar",
    "Low budget flats Karimnagar",
    "Best property investment Karimnagar",
    "Resale flats Karimnagar",
    "Ready to move flats Karimnagar",
    "Under construction projects Karimnagar",
    "Bank loan approved projects",
    "HMDA approved layouts Karimnagar",
    "DTCP approved plots Karimnagar",

    // General SEO
    "Best Homes in Karimnagar",
    "Best Villas in Karimnagar",
    "Best communities in Karimnagar",
    "Karimnagar Homes",
    "Karimnagar villas",
    "Best Apartments in Karimnagar",
    "Karimnagar Properties",
    "Community Living in karimnagar",

    // Top Rated & Best Categories
    "Best community in Karimnagar",
    "Best builders in Karimnagar",
    "Best construction company in Karimnagar",
    "Best villas in Karimnagar",
    "Best apartments in Karimnagar",
    "Top rated builders Karimnagar",
    "Best real estate company Karimnagar",
    "Best gated community Karimnagar",
    "Best residential projects Karimnagar",
    "Best luxury homes Karimnagar",
  ].join(", "),
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
  openGraph: {
    title: "HSR Green Homes | Top Rated Builders in Karimnagar",
    description: "Discover premium living. We build luxury apartments and gated communities with 100% Vastu compliance.",
    type: "website",
    locale: "en_IN",
    siteName: "HSR Green Homes",
    images: [
      {
        url: 'https://hsrgreenhomes.com/images/logo.png',
        width: 800,
        height: 600,
        alt: 'HSR Green Homes Logo',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HSR Green Homes | Best Builders in Karimnagar",
    description: "Discover your dream home with Karimnagar's most trusted developer.",
    images: ['https://hsrgreenhomes.com/images/logo.png'],
  },
  other: {
    "geo.region": "IN-TG",
    "geo.placename": "Karimnagar",
    "geo.position": "18.4386;79.1288",
    "ICBM": "18.4386, 79.1288",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "HSR Green Homes",
    "legalName": "HSR Green Homes Developers",
    "url": "https://hsrgreenhomes.com",
    "logo": "https://hsrgreenhomes.com/images/logo.png",
    "image": "https://hsrgreenhomes.com/images/logo.png",
    "description": "Leading builders in Karimnagar offering premium 2BHK and 3BHK luxury apartments, gated communities, and Vastu-compliant residential projects since 2009.",
    "telephone": "+919876543210",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "HSR Green Homes Building, [Insert Exact Street]",
      "addressLocality": "Karimnagar",
      "addressRegion": "Telangana",
      "postalCode": "505001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "18.4386",
      "longitude": "79.1288"
    },
    "areaServed": [
      "Karimnagar",
      "Jagtial",
      "Warangal",
      "Peddapalli",
      "Sircilla",
      "Godavarikhani"
    ],
    "priceRange": "₹28 Lakhs - ₹1.5 Crores",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Construction Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Luxury Apartment Construction"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Gated Community Development"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Vastu Consultation for Homes"
          }
        }
      ]
    },
    "sameAs": [
      "https://www.facebook.com/hsrgreenhomes",
      "https://www.instagram.com/hsrgreenhomes",
      "https://twitter.com/hsrgreenhomes"
    ]
  };

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen antialiased">
        <LoadingScreen />
        <ErrorBoundary>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ErrorBoundary>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}

