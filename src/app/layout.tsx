import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import LayoutWrapper from "@/components/common/LayoutWrapper";
import LoadingScreen from "@/components/common/LoadingScreen";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HSR Green Homes | Best Builders & Luxury Properties in Karimnagar",
  description: "Discover premium apartments, villas, and community living in Karimnagar. HSR Green Homes offers the best residential properties with 100% Vasthu compliance, timely delivery, and superior quality construction. Trusted by 2000+ families.",
  keywords: [
    "Best Builders in Karimnagar",
    "Best Homes in Karimnagar",
    "Best Villas in Karimnagar",
    "Best communities in Karimnagar",
    "Karimnagar Homes",
    "Karimnagar villas",
    "Best Apartments in Karimnagar",
    "Best properties in Karimnagar",
    "Karimnagar Properties",
    "Green Homes Karimnagar",
    "Community Living in karimnagar",
    "Luxury Apartments Karimnagar",
    "Real Estate Developers Karimnagar",
    "Gated Communities Karimnagar"
  ].join(", "),
  openGraph: {
    title: "HSR Green Homes | Best Builders & Luxury Properties in Karimnagar",
    description: "Premium residential projects in Karimnagar. 100% Vasthu compliant, timely delivery, and exceptional quality.",
    type: "website",
    locale: "en_IN",
    siteName: "HSR Green Homes",
  },
  twitter: {
    card: "summary_large_image",
    title: "HSR Green Homes | Best Builders in Karimnagar",
    description: "Discover your dream home with Karimnagar's most trusted developer.",
  }
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
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen antialiased">
        <LoadingScreen />
        <ErrorBoundary>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ErrorBoundary>
      </body>
    </html>
  );
}

