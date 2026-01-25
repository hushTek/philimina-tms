import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "@/app/global.css";

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from "@clerk/nextjs";

import { ConvexProviderWithClerk } from "convex/react-clerk";
import AppProviders from "./providers";

import { LanguageProvider } from "@/components/language-provider";
import { SiteHeader } from "@/components/site-header";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });


export const metadata: Metadata = {
  title: "TFM - Chap Chap",
  description: "A platform to help you manage your money",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProviders>
      <LanguageProvider>
        <html lang="en" className={`${figtree.variable} ${figtree.variable} antialiased`}>
          <body>
            <SiteHeader />
            {children}
          </body>
        </html>
      </LanguageProvider>
    </AppProviders>
  );
}
