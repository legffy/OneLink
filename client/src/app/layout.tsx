import type { Metadata } from "next";
import type { CSSProperties } from "react";
import NavBar from "./components/navBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "OneLink",
  description: "RPI building directory and campus navigation.",
  icons: {icon:"./logo.png",},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
        style={
          {
            "--font-geist-sans": "Arial, Helvetica, sans-serif",
            "--font-geist-mono": '"Courier New", Courier, monospace',
          } as CSSProperties
        }
      >
        <NavBar />
        {children}
      </body>
    </html>
  );
}
