import "~/styles/globals.css";

import { Toaster } from "~/components/ui/sonner";
import { Inter } from "next/font/google";
import Nav from "~/components/nav";
import Providers from "~/components/providers";

export const metadata = {
  title: "Spotlxght",
  description: "Streamline booking between musicians and venues.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
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
