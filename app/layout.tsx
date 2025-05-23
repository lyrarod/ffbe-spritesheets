import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Final Fantasy: Brave Exvius | FFBE",
    default: "Final Fantasy: Brave Exvius | FFBE",
  },
  description: "Final Fantasy: Brave Exvius | FFBE | Animations | Spritesheets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
