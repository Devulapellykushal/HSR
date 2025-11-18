import type { Metadata, Viewport } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/common/LayoutWrapper";

export const metadata: Metadata = {
  title: "HSR Green Homes - Premium Living in Karimnagar",
  description: "Discover luxury residential projects that blend modern comfort with traditional values. Your dream home awaits at HSR Green Homes.",
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
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}

