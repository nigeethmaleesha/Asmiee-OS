import type { Metadata, Viewport } from "next";
import { AppProvider } from "@/context/app-context";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Asmiee OS", template: "%s · Asmiee OS" },
  description: "Asmiee internal client, project, task, communication and approval management platform.",
  applicationName: "Asmiee OS",
  robots: { index: false, follow: false },
  openGraph: { title: "Asmiee OS", description: "Connected business operations workspace for Asmiee.", type: "website" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0d1526" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AppProvider>{children}</AppProvider></body></html>;
}
