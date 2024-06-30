import "~/styles/globals.css";

import { Toaster } from "~/components/ui/sonner";
import { Inter } from "next/font/google";
import Nav from "~/components/nav";
import Providers from "~/components/providers";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Spotlxght",
  description: "Streamline booking between musicians and venues.",
  icons: [{ rel: "icon", url: "/images/icon.png" }],
  openGraph: {
    type: "website",
    description: "Streamline booking between musicians and venues.",
    siteName: "Spotlxght",
    images: [
      {
        url: "https://spotlxght.com/images/og-card.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    description: "Streamline booking between musicians and venues.",
    site: "Spotlxght",
    images: "https://spotlxght.com/images/twitter-card.png",
  },
};

const inter = Inter({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} dark`}>
      <body>
        <main className="flex h-screen flex-col">
          <Nav />
          <Providers>{children}</Providers>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
