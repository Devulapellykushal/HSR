import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import LayoutWrapper from "@/components/common/LayoutWrapper";
import LoadingScreen from "@/components/common/LoadingScreen";
import type { Metadata, Viewport } from "next";
import "./globals.css";

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
        <LoadingScreen />
        <ErrorBoundary>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ErrorBoundary>
      </body>
    </html>
  );
}

