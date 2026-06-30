import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { ToastProvider } from "@/components/ui/Toast";
import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "LaunchPadX | Invest in Tomorrow's Most Promising Startups",
  description: "LaunchPadX connects visionary founders with investors around the world. Secure equity crowdfunding platform built for high-growth tech, AI, healthcare, and green energy startups.",
  keywords: ["startup funding", "crowdfunding platform", "invest in startups", "equity crowdfunding", "fintech platform"],
  authors: [{ name: "LaunchPadX Team" }],
  creator: "LaunchPadX Team",
  publisher: "LaunchPadX",
  applicationName: "LaunchPadX",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "LaunchPadX | Invest in Tomorrow's Most Promising Startups",
    description: "LaunchPadX connects visionary founders with investors around the world.",
    type: "website",
    locale: "en_US",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "LaunchPadX | Invest in Tomorrow's Most Promising Startups",
    description: "LaunchPadX connects visionary founders with investors around the world.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans min-h-screen bg-background text-foreground antialiased flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <QueryProvider>
              <ToastProvider>
                <AnimatedBackground />
                {children}
                <ScrollToTopButton />
              </ToastProvider>
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
